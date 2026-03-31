# React Native Reusables - Technical Analysis

**Author:** Hayat Dahraj
**Date:** March 17, 2026

---

## What This Is

So Jacob found React Native Reusables which is basically shadcn/ui ported to React Native. I wanted shadcn originally but it doesnt work with React Native so this is the closest thing. Jacob went ahead and got it running on a fork which is great. Before we commit to anything though I wanted to actually look at what it would take to bring this into our codebase because I didnt want us to jump in and then realize halfway through that we bit off more than we could chew.

I went through every file in the project and mapped out exactly what our current styling system looks like and what would need to change. Heres everything I found.

---

## What We Have Right Now

Our entire app uses pure React Native StyleSheet with a custom theme system I built. No Tailwind, no NativeWind, no className anywhere. Just StyleSheet.create and useThemeColor calls.

The numbers:

- **42 files** use `useThemeColor()` to pull colors from the theme
- **36 files** use `StyleSheet.create()` for layout and styling
- **32 color tokens** defined across light and dark themes (16 each)
- **Zero** NativeWind or Tailwind config exists in the project
- **Zero** className-based styling anywhere

The way it works right now is every component calls useThemeColor to get the right color for the current theme and then applies it inline or through StyleSheet. For example a typical screen looks like this:

```tsx
const bg = useThemeColor({}, "background");
const textColor = useThemeColor({}, "text");

<View style={[styles.container, { backgroundColor: bg }]}>
  <Text style={[styles.title, { color: textColor }]}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
});
```

Every screen does this. The theme itself is managed through a React Context (ThemeContext.tsx) that I built specifically to fix the Android crash where Appearance.setColorScheme was blowing up. That context is what makes dark mode work without crashing. Its not optional, it has to stay no matter what we do.

---

## What React Native Reusables Needs To Work

This isnt a drop in library. To get Reusables running you need an entire styling infrastructure underneath it. Heres what would need to be installed and configured:

### New Dependencies
- **NativeWind v4** - this is the engine that makes Tailwind classes work in React Native. It compiles className strings into native styles at build time
- **tailwindcss** - the actual Tailwind CSS engine that NativeWind depends on

### New Config Files
- **tailwind.config.js** - this is where all our color tokens would need to be mapped. Right now our colors live in theme.ts, theyd need to be duplicated or moved into this config
- **global.css** - Tailwind needs a CSS file with its directives (@tailwind base, components, utilities)
- **nativewind-env.d.ts** - TypeScript needs this so it doesnt throw errors when you put className on React Native components (since RN components dont natively accept className)

### Build System Changes
- **babel.config.js** - NativeWind requires a Babel plugin to transform the className props at compile time
- **metro.config.js** - NativeWind hooks into Metro (our bundler) to process the Tailwind classes. This is the part that makes me nervous because we already have Expo and Amplify in the build pipeline and adding another tool that hooks into Metro and Babel is another point of failure

---

## What Changes In Every Existing File

If we go full migration every one of those 36 files with StyleSheet.create would need to be rewritten. Heres what that looks like concretely.

### The Style Blocks Get Deleted

Every file has a StyleSheet.create block at the bottom, usually 30 to 80 lines of style definitions. All of that goes away and gets replaced with Tailwind classes inline on the components.

### useThemeColor Calls Get Removed

Most files have 4 to 6 useThemeColor calls at the top of the component. Those all go away because NativeWind handles theming through its own dark mode system using the dark: prefix on classes.

### Every style Prop Becomes className

Every single JSX element that has a style prop needs to be converted to className with the equivalent Tailwind utility classes. So `style={{ flex: 1, padding: 16, backgroundColor: bg }}` becomes `className="flex-1 p-4 bg-background"`.

### Heres a Before and After

**Before (what we have now):**
```tsx
const bg = useThemeColor({}, "background");
const cardBg = useThemeColor({}, "cardBackground");
const textColor = useThemeColor({}, "text");
const tint = useThemeColor({}, "tint");

return (
  <View style={[styles.container, { backgroundColor: bg }]}>
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.title, { color: textColor }]}>Welcome</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: tint }]}>
        <Text style={styles.buttonText}>Go</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  button: { padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
```

**After (with Reusables/NativeWind):**
```tsx
return (
  <View className="flex-1 p-4 bg-background">
    <View className="rounded-xl p-4 mb-3 bg-card">
      <Text className="text-2xl font-bold text-foreground">Welcome</Text>
      <TouchableOpacity className="p-3 rounded-lg items-center bg-primary">
        <Text className="text-white font-semibold">Go</Text>
      </TouchableOpacity>
    </View>
  </View>
);
// No StyleSheet block, no useThemeColor calls
```

Its cleaner for sure. But getting there means touching every file.

---

## The Theme System Migration

This is probably the most involved part. Right now our 32 color tokens live in theme.ts and get accessed through useThemeColor. With NativeWind all of those tokens need to be mapped into tailwind.config.js so Tailwind knows what bg-background or text-foreground means.

That mapping would look something like this:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--text)',
        card: 'var(--cardBackground)',
        'card-foreground': 'var(--text)',
        muted: 'var(--placeholderText)',
        primary: 'var(--tint)',
        destructive: 'var(--urgent)',
        border: 'var(--buttonBorder)',
        // ... all 16 tokens mapped for both themes
      }
    }
  }
}
```

On top of that our ThemeContext needs to keep working. I built that context specifically to avoid the Android Appearance API crash and it manages theme state through React instead of the native layer. NativeWind has its own dark mode toggle system. We would need to wire our ThemeContext into NativeWind's dark mode so they stay in sync. If they get out of sync you get light mode colors on a dark background or vice versa which looks broken.

---

## What I Think The Real Risks Are

### Build Pipeline Complexity
We already have Expo 54, AWS Amplify with codegen, and React Navigation all in the build chain. NativeWind adds hooks into both Babel and Metro. If something conflicts during a build youre not debugging your app code anymore youre debugging build tooling and thats a time sink that doesnt produce features.

### Two Styling Systems Living Side By Side
If we only convert some screens (which is the more realistic path) then we have two completely different ways of styling in the same codebase. New developers or teammates would need to understand both useThemeColor + StyleSheet AND NativeWind + className. Every PR review becomes "which system is this screen using" and thats friction.

### 42 Files Is A Lot Of Surface Area
Even if each file only takes 15 minutes to convert thats over 10 hours of just mechanical conversion work. Then you need to test every single screen in both light mode and dark mode on both iOS and Android. Thats not feature work thats migration work and any regression that slips through means more time spent debugging.

### The Card.tsx Issue
I found that our Card.tsx component is calling useThemeColor inside StyleSheet.create which is actually a React rules-of-hooks violation. It works by accident right now. A migration would fix this but it also shows there are fragile spots in the codebase that could break unexpectedly during conversion.

---

## The Options As I See Them

### Option A: Full Migration
Convert all 42 files. Remove useThemeColor and StyleSheet everywhere. Everything goes through NativeWind and Reusables. Consistent codebase, modern styling, but massive time investment and high regression risk.

### Option B: New Screens Only
Install NativeWind, add the config, use Reusables for any new screens or features going forward. Existing screens stay as they are. Lower risk but you permanently have two styling systems in the project.

### Option C: Dont Adopt It
Keep building on what we have. Jacob extracts the existing components into reusable pieces and standardizes the StyleSheet patterns across the app. No new dependencies, no build changes, no migration risk. We just make what we have more consistent.

---

## What We Are Actually Doing (Update - March 17, 2026)

After talking with Jacob it turns out the situation is way less scary than what I outlined above. A full migration is not happening and it doesnt need to. What Jacob is actually doing on his fork is dropping Reusables components into existing screens alongside our current StyleSheet code and it just works.

The key thing I didnt account for in the original analysis is that NativeWind components accept regular `style` props the same way any React Native component does. So you can do this:

```tsx
// Reusables component styled with our existing StyleSheet approach
<Button style={[styles.myButton, { backgroundColor: tint }]}>
  <Text style={styles.buttonText}>Send</Text>
</Button>
```

The NativeWind styles baked into the Reusables components are just defaults. Anything we pass through `style` overrides or merges with them. This means we dont have to rewrite any of our existing styling, we dont have to convert style props to className, and we dont have to touch useThemeColor. We just use the Reusables components as better looking building blocks inside our existing screens.

### What Jacob Has Done So Far
- Set up all the NativeWind dependencies on his fork (not a branch, specifically to isolate risk)
- Got the build working with Expo and Amplify without issues
- Integrated the simpler Reusables components into a few screens already
- Confirmed that our existing StyleSheet styles apply to the Reusables components without conflict
- Extracted common styles from the home screen into a shared file so they can be referenced from one place instead of being copied onto every page
- Started enhancing the Card component (will document with a diagram later)

### Why This Works
NativeWind is designed to coexist with StyleSheet. The Reusables components are just React Native components under the hood with some default NativeWind styling. When you apply a `style` prop on top of them it works exactly the same as any other RN component. No migration needed, no two-system confusion, no rewriting 42 files.

### The Approach Going Forward
- Keep all existing screens and their StyleSheet/useThemeColor styling as is
- Drop in Reusables components where they improve the look and feel
- Style them using our existing patterns (StyleSheet + useThemeColor)
- Common styles get extracted into shared files for reuse across screens
- Jacob will PR the fork back to main once the component integration is solid

This is the best of both worlds. We get the polished shadcn-style components without any of the migration risk I was worried about.
