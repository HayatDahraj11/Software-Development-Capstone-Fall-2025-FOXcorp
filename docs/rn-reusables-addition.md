Howdy,

I spent the past week implementing [React Native Reusables](https://reactnativereusables.com/) components into our app. The short of it is that **we can now use components from this library, plug and play**, with minor tweaks needed to make them fit our style.

# React Native Reusables
_aka rnu_

[React Native Reusables](https://reactnativereusables.com/) is a component library built for React Native based upon the popular [shadcn/ui](https://ui.shadcn.com/) library. 

RNU is built upon the [Nativewind](https://www.nativewind.dev/) style library, which is a different library from the one our app uses predominantly, StyleSheets. Despite this, _you can still use StyleSheet modifications on RNU components_. Nativewind is designed to work in tandem with StyleSheets, and so far in my development I have run in to zero issues with applying a StyleSheet to an RNU component.

## How to Use an RNU Component
All installed RNU components can be found in `@/src/rnreusables/ui` within their own files. 

Let's say you wanted to install and use the RNU "Button" component (this component is already installed, but steps can be followed for any). Go to the RNU website and find the [Button component page](https://reactnativereusables.com/docs/components/button). Within the page, find the "Installation" header. Under it is a command you will use to install this component: `npx @react-native-reusables/cli@latest add button`. Run this command and, presuming no errors, the component will be added as `@/src/rnreusables/ui/Button.tsx`. **Keep this page open, as it will provide atleast two use cases of the component alongside the code to use it.**

Go to the page you want to use this component in, let's say `@/app/login/school-selection.tsx`, and add `import { Button } from "@/src/rnreusables/ui/button"`. You can now use the component! Be sure to check the site you found the component at for in-code examples of how the component can be used. Within `school-selection.tsx`, here is a few examples of the button in use: 

```tsx
// at lines 92-99
// note how styles are applied to the button! while the button will fundamentally use Nativewind for its style, StyleSheets can be applied to make changes on top of that.
<Button variant="outline" style={[styles.selectionInput, {backgroundColor: fullbrightcolor}, {borderColor: buttonbordercolor}]} onPress={() => setIsDialogOpen(true)}>
    {school ? (
        <Text style={[styles.selectionInputText, {color: listtextcolor}]}>{school}</Text>
    ) : (
        <Text style={[styles.placeholderText, {color: placeholdertextcolor}]}>Select your school...</Text>
    )}
    <Feather name="chevron-down" size={20} color={placeholdertextcolor} />
</Button>

...

// at lines 122-125
<Button variant={"default"} style={[styles.pressable, {backgroundColor: tintcolor}, {shadowColor: tintcolor}]} onPress={sendToLogin}>
    <Text style={[styles.pressableLabel, {color: fullbrightcolor}]}>Continue to Login</Text>
    <Feather name="arrow-right" size={20} color={fullbrightcolor} style={{ marginLeft: 8 }} />
</Button>
```

### Examples of Each in Use
So far, I have implemented the [Button](https://reactnativereusables.com/docs/components/button), [Dialog](https://reactnativereusables.com/docs/components/dialog), [Select](https://reactnativereusables.com/docs/components/select), [RadioGroup](https://reactnativereusables.com/docs/components/radio-group), [Label](https://reactnativereusables.com/docs/components/label), and [Avatar](https://reactnativereusables.com/docs/components/avatar) components within the app. For examples of each see:
- Button: `@/app/login/school-selection.tsx`
- Dialog: `@/app/login/school-selection.tsx`, `@/app/(parent)/(tabs)/general-info.tsx`, and `@/app/(parent)/(tabs)/(hamburger)/settings.tsx`
- Select: `@/app/(parent)/(tabs)/general-info.tsx`
- RadioGroup: `@/app/(parent)/(tabs)/(hamburger)/settings.tsx`
- Label: `@/app/(parent)/(tabs)/(hamburger)/settings.tsx`
- Avatar: `@/src/features/class-viewer/ui/Parent_ViewClassComponent.tsx`

## Fundamental Changes to Facilitate RNU 
As stated previously, using RNU required the addition of the Nativewind library as well as a bunch of config changes and additions. The exact changelog to add these libraries can be found in these commits: [82c443b](https://github.com/HayatDahraj11/Software-Development-Capstone-Fall-2025-FOXcorp/commit/82c443b16cd36527cdb1e83d516290b6558199a3) and [46bf039](https://github.com/HayatDahraj11/Software-Development-Capstone-Fall-2025-FOXcorp/commit/46bf039472814393082cc6da38d33fc467b0c344).

File additions are mostly config or environment files in the root. Unless you know what you are doing, _do not mess with these files_. These are fundamental to the usage of the components, and they've caused no issues for me so far. These files include: 
- `@/global.css`
- `@/nativewind-env.d.ts`
- `@/metro.config.js`
- `@/tailwind.config.js`
- `@/babel.config.js`
- `@/lib/theme.ts`
- `@/lib/utils.ts`

The last two `@/lib/` files are used exclusively by Nativewind and RNU components. _These files do not replace our `theme.ts` file at `@/src/features/app-themes/constants/theme.ts`_.

Some root-level app files have been adjusted aswell. 
- The root `_layout.tsx` file has new includes that shouldn't be removed: `import "@/global.css"`, `import { NAV_THEME } from "@/lib/theme"`
and `import { useColorScheme } from "nativewind"`.
- `@/src/features/app-themes/logic/ThemeContext.tsx` now utilizes the Nativewind `useColorScheme()` function, which applies theme changes to both stylesheet and nativewind styled components.

# New Card Component
The card component has been redesigned and refitted to match the needs we have for it now. See a diagram describing this [here](https://postimg.cc/4n0TL7FX).

All cards used previously _should_ still work as intended. This rework does not make any breaking changes, and any new functionality is _in addition to_, not _in replacement of_.

We have three new optional properties you can call when adding a card:
- `icon?: {name, size, color, backgroundColor}`: Defining an Ionicons icon that will be placed on the left side of the card, aswell as the size, color, and background color of this icon.
- `badge?: {type, content, contentColor, BackgroundColor}`: **Only rendered on Urgent cards.** This adds a small info square/circle to the rigth side of the card displaying quick info, i.e. the number of unread messages. This can be added in two types: TextBadge (0) which displays a >2 character set of info, and NumberBadge (1) which displayes a <=2 character set of info.
- `pressable?: Boolean`: All this does is add a right-facing chevron to the right side of the card, implying that the card can be pressed. This does not change functionality, just how its shown.

## Other Component Changes
**`Parent_ChildPicker.tsx`** is now deprecated, as its functionality has been abstracted into the RNU Select component. See `@/app/(parent)/(home)/general-info.tsx` for an example.

**`Parent_ViewClass.tsx`** has been copied into `Parent_ViewClassComponent.tsx`, which takes the functionality of the old modal and puts it within an component. This was done so ViewClass can be placed within the RNU Dialog component. See `@/app/(parent)/(home)/general-info.tsx` for an example.

**`SchoolPicker.tsx`** has been copied into `SchoolPickerComponent.tsx`, which, like the last example, takes the functionality of the old modal and puts it within a component. This was also done so it can be placed within an RNU Dialog component. See `@/app/login/school-selection.tsx` for an example.

# Abstracting Stylesheets into One File
I noticed that we reuse similarly styled components on multiple screens by literally copy-pasting the stylesheets of the components to each page. This, in my opinion, brings two potential issues: reusing styles is a pain in the rear and iterating on designs is also a pain in the rear. Like the abstracting of colorscheme to `theme.ts` that I did previous, I abstracted common styles to `stylesheets.ts` (found at `@/src/features/app-themes/constants`). 

I separated style parameters into common stylesheet groups, like a `containterStyle` stylesheet which holds styles used for the main `container` of a screen, aswell as a `<ScrollView />`'s `scrollContent` style. Changes like this allow each screen to look and function similarly, aswell as allowing changes to a style on one screen be reflected on all screens. **Check out the Parent's Home and General Info screens for an example of this in use.**

# Minor Changes
## Async Storage Update
Previously, the storage only allowed the user to save their current theme as _dark mode_ and _light mode_. Usually, apps have a _system default_ mode aswell to match the app to whatever the user's system theme is. The async storage now allows for that functionality, with the settings screen being updated to match this. **Check the Parent's Settings Screen for an example of this in use.**

In addition, `ThemeContext.tsx`, the root context file for our app theme, has added a new var called `systemTheme`. This var _only_ stores the OS's current theme, and that's it. The app theme related logic files love to reference the OS's theme as a fallback value, so this comes in handy to reflect the true system theme instead of the previously used theme.
## Screen Redesigns
I combined the _general info_ and _student schedule_ screens into one, allowing the user to see the schedule directly on this screen. This, to me, made more sense then making the user click through the schedule card to see details on each class. 
## Pulling Theme Calls Out of StyleSheets
Both because the StyleSheets are going to be abstracted, and to remove clutter, any theme/color calls are going to be placed on their own within screen logic. For example:
```tsx
// parent's home screen
export default function ParentHomeScreen() {
    ...

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tint = useThemeColor({}, "tint");
    const urgent = useThemeColor({}, "urgent");
```
Anytime you want to use a color now it has to be included in a list within the style call like this: 
```tsx
// parent's home screen

{/* Hero Welcome Section */}
<View style={homeScreenHeroStyle.heroSection}>
    <View style={homeScreenHeroStyle.heroTop}>
        <View>
            <Text style={[homeScreenHeroStyle.greeting, { color: textColor }]}> // see here!
                Welcome back,
            </Text>
            <Text style={[homeScreenHeroStyle.userName, { color: textColor }]}> // see here!
                {userParent.firstName}
            </Text>
        </View>
        <View style={[homeScreenHeroStyle.avatarCircle, { backgroundColor: tint }]}> // see here!
            <Text style={homeScreenHeroStyle.avatarText}>
                {userParent.firstName?.[0]}{userParent.lastName?.[0]}
            </Text>
        </View>
    </View>
    <Text style={[homeScreenHeroStyle.dateText, { color: subtextColor }]}>{today}</Text> // see here!
</View>
```
