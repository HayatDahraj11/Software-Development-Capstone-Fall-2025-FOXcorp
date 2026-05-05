# read receipts test plan

manual checklist that needs to pass before merging this branch. design lives in READ_RECEIPTS.md.

## existing functionality (regression gate, do this FIRST)

before touching anything related to read receipts, confirm the messaging system still works exactly as it did. read receipts are deliberately additive but its still the messaging code so any regression here is a hard blocker.

- [ ] parent sends a message to a teacher. message appears in the parents thread, in the teachers inbox preview, in the teachers thread (via realtime sub).
- [ ] teacher replies. same flow in reverse.
- [ ] push notification fires on the recipients device for both directions.
- [ ] open a clara thread as a parent, send a message. clara replies within ~10s. NO push notification fires for the clara reply (this is the special branch in sendMessage).
- [ ] pull-to-refresh on both inbox screens still works.
- [ ] optimistic send: throttle the network, send a message. bubble appears immediately and settles to the confirmed message id. send while offline, bubble appears then disappears with an error toast.

if any of these fail, stop and bisect. read receipts work isnt the cause but its on the same branch so its on the hook.

## new behavior (read receipts)

ideally on two devices so you can see the live updates. parent on one, teacher on the other.

- [ ] parent sends "hi" to teacher. teachers inbox row shows the unread dot (small tinted dot next to the timestamp). parents bubble shows NO Seen label.
- [ ] teacher opens the thread. within ~1s parent sees "Seen" appear under "hi".
- [ ] teachers inbox dot disappears.
- [ ] parent sends a second message while teacher is still on the thread. Seen label advances to the new message. dot does not reappear for teacher.
- [ ] both close the thread. parent sends a third message. teachers dot reappears.
- [ ] parent backgrounds the app then reopens to the thread. lastReadAt re-stamps (no visible UI change but you can confirm in DynamoDB if youre testing thoroughly).
- [ ] cold start the app. inbox shows the dot for any thread where lastMessageAt > myLastReadAt.

## edge cases

- [ ] conversation with parentLastReadAt null (never opened): dot shows if there are any messages.
- [ ] thread where the latest message is from the viewer themselves: dot still shows in v1. known limitation, see "todo" in READ_RECEIPTS.md for the v2 fix that needs lastMessageSenderId.
- [ ] group thread (teacher broadcast to a class): NO Seen label rendered, NO dot for parents on the inbox. teacher viewing the group thread DOES get a dot since theyre the only teacher and we use teacherLastReadAt. no crash either way.
- [ ] clara thread: known issue, parent will never see "Seen" on their messages to clara because the clara lambda doesnt stamp teacherLastReadAt yet. punted to v1.5. mention this in the demo if asked.
- [ ] sender is on the thread when their own message gets a "delivered" subscription event: should not stamp Seen for themselves (they are not the other party). verified in computeSeen tests.

## platform smoke

- [ ] iOS simulator: all of the above
- [ ] android emulator or device: all of the above
- [ ] dark mode + light mode: dot uses the app tint color which adapts. confirm visible against the row background in both.

## automated

run `npx jest` from project-clara/. all 56 tests should pass:

- 35 existing (regression check, no behaviour changes from before)
- 15 in __tests__/messaging/readReceipts.test.ts (computeUnread and computeSeen rules across all branches including GROUP and never-opened)
- 6 in __tests__/messaging/markConversationRead.test.ts (right field per role, never touches lastMessageText/At, no-op on empty id, swallows errors, ISO timestamp close to now)

if any test fails do not push. fix or roll back.

## deploy gate

this branch will NOT show receipts in the running app until the schema is deployed. order of operations:

1. `amplify status` (check for drift before pushing schema)
2. `amplify push` (creates the new columns in DynamoDB + redeploys AppSync)
3. `amplify codegen` (regenerates src/graphql/* to pick up the new fields)

if someone builds and runs the app BEFORE amplify push, the markConversationRead writes will fail server-side with unknown field warnings in the console. rest of messaging keeps working fine because we dont touch sendMessage. read receipts just degrade to "no receipts" silently until the schema is up.

## rollback

if anything regresses after deploy:

- code only: `git revert` the impl commit. schema columns sit harmless in dynamo until you also revert and amplify push the schema back.
- in-flight kill switch: change markConversationRead to a no-op via a single constant at the top of markConversationRead.ts. removes the only write the new code makes, leaves UI rendering as if no one has ever read anything. zero impact on send/recv.
