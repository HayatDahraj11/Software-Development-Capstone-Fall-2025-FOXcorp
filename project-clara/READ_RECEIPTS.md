# read receipts plan

what: parents and teachers should see if their messages were seen by the other side. plus a small dot on the inbox row when there's something unread.

scope v1: only DIRECT 1:1 threads. group broadcasts later (those need a join table, not worth the complexity right now).

## the idea

simplest thing that works: two new timestamp columns on the Conversation row, `parentLastReadAt` and `teacherLastReadAt`. when you open a thread we stamp your side. that's it.

i thought about doing a `readBy: [ID]` list on each Message, ruled it out:
- the list keeps growing every re-read
- two devices reading the same thread = lost writes (AppSync replaces lists, doesn't append)
- counting unread = scan every message in the thread
- writes blow up: open one thread = N row updates instead of 1

so just two timestamps per convo. one write per "open". math falls out:
- "did they see msg X?"  ->  `msg.createdAt <= otherLastReadAt`
- "do i have unread on this row?"  ->  `conv.lastMessageAt > myLastReadAt`

## schema (additive only)

```graphql
type Conversation @model @auth(rules: [{ allow: public }]) {
  ... existing fields stay exactly as they are ...
  parentLastReadAt:  AWSDateTime
  teacherLastReadAt: AWSDateTime
}
```

both nullable. null = "never opened" = "everything unread". no backfill needed.

after editing:
```
amplify status
amplify push
amplify codegen
```

## code changes (all backwards compatible)

`messageRepo.ts`:
- add the 2 new fields to the `Conversation` interface (optional)
- new helper `markConversationRead({ conversationId, viewerRole })`. fire and forget. writes ONLY the side-specific field, so no collision with `sendMessage`'s preview update which writes lastMessageText/At.
- re-export `onUpdateConversation` as `ON_UPDATE_CONVERSATION`

`useConversations.ts`: add a subscription to `onUpdateConversation` filtered by the viewer's parentId or teacherId. patch matching row in state when an update lands. so the unread dot disappears live without a refresh.

`useMessages.ts`: track `otherLastReadAt` in state. seed from `getConversation` on mount. update from an `onUpdateConversation` sub scoped to this conv id. return it from the hook.

`MessageBubble.tsx`: optional new props `isLastOwnMessage` + `otherLastReadAt`, both default safe (false / null). render a small "Seen" under the latest own bubble when `otherLastReadAt` is past the message's createdAt. only on the latest own one to avoid a wall of "Seen Seen Seen".

`ConversationItem.tsx`: optional `hasUnread` prop (default false). bold title + a small dot when true.

`ConversationList.tsx`: optional `getHasUnread` fn prop, called per row, default returns false.

screens (4 files):
- `(parent)/conversation.tsx` + `(teacher)/conversation.tsx`: useEffect calling `markConversationRead` on mount and on every messages.length change. pass the new props to MessageBubble.
- `(parent)/(tabs)/messaging.tsx` + `(teacher)/(class)/(tabs)/messaging.tsx`: pass `getHasUnread` to ConversationList.

## DO NOT BREAK

stuff that's load-bearing and i'm explicitly NOT touching:

- `sendMessage()` in messageRepo. its side effect chain (preview update, push notif, clara trigger) stays exactly as is.
- anything in `src/graphql/*` (codegen owns those, hand-edits get blown away on next codegen run)
- auth rules on Conversation / Message
- Lambdas. clara backend doesn't need to know about read receipts. (open question: should clara stamp `teacherLastReadAt` after replying so parents see "Seen" on their messages to clara? probably yes, small lambda change. punting to v1.5.)
- new component props are optional with safe defaults so old callers compile + render identically

## group threads

GROUP threads have N parents + 1 teacher. one column per parent doesnt scale. v1 behavior:
- bubble: no Seen rendered
- inbox row: no dot for parents in group threads (teacher still gets it because they're the only teacher, can use teacherLastReadAt)
- no crash, no weird states

v2: either a `MessageRead` join table or a `UserConversationState` table. not now.

## tests

no messaging tests today. add a unit test for `markConversationRead` in `__tests__/messaging/`. follow the `incidentRepo.test.ts` pattern (mock `generateClient().graphql`, assert call shape).

manual smoke checklist before merging:
- send + recv parent -> teacher
- send + recv teacher -> parent
- clara reply still works (this is the main regression risk)
- push notif still fires for both directions
- open thread on second device, watch "Seen" appear on sender side
- inbox dot appears on new msg, disappears on open
- group thread: no Seen, no crash

## rollback

worst case: `git revert` the impl commit, schema columns sit harmlessly in dynamo (or revert schema and `amplify push` again). there's also a tiny in-flight kill switch: change `markConversationRead` to a no-op via one constant at the top of messageRepo if it ever causes problems in prod.

## todo

- [ ] schema edit + amplify push + codegen
- [ ] messageRepo: types + markConversationRead + export sub
- [ ] useConversations: sub
- [ ] useMessages: otherLastReadAt
- [ ] MessageBubble: Seen
- [ ] ConversationItem: dot + bold
- [ ] ConversationList: getHasUnread
- [ ] 4 screens wired
- [ ] clara lambda decision (does it stamp on reply?)
- [ ] unit test for markConversationRead
- [ ] manual qa pass

est ~3-4hrs end to end if amplify push doesnt fight back
