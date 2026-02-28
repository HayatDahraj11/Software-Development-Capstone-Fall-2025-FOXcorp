/**
 * Quick smoke test for the messaging backend.
 * Run this from the app by importing and calling testMessaging()
 * from any screen (e.g. temporarily in the parent home screen).
 *
 * It will:
 * 1. Create a test conversation
 * 2. Send two messages into it
 * 3. Fetch the messages back
 * 4. Log everything to the console
 *
 * Delete this file once you have confirmed everything works.
 */

import {
  getOrCreateDirectConversation,
  sendMessage,
  fetchMessages,
  fetchConversationsByParent,
} from "@/src/features/messaging/api/messageRepo";

export async function testMessaging() {
  console.log("=== MESSAGING SMOKE TEST START ===");

  // Step 1: Create a conversation
  console.log("\n[1/4] Creating test conversation...");
  const convoResult = await getOrCreateDirectConversation({
    parentId: "test-parent-001",
    teacherId: "test-teacher-001",
    studentId: "test-student-001",
    parentName: "Test Parent",
    teacherName: "Test Teacher",
    studentName: "Test Student",
  });

  if (convoResult.error || !convoResult.data) {
    console.error("FAILED to create conversation:", convoResult.error);
    return;
  }

  const convo = convoResult.data;
  console.log("SUCCESS: Created conversation", convo.id);
  console.log("  type:", convo.type);
  console.log("  parentName:", convo.parentName);
  console.log("  teacherName:", convo.teacherName);

  // Step 2: Send a message from the parent
  console.log("\n[2/4] Sending message from parent...");
  const msg1Result = await sendMessage({
    conversationId: convo.id,
    senderId: "test-parent-001",
    senderType: "PARENT",
    senderName: "Test Parent",
    body: "Hey, how is my kid doing in class?",
  });

  if (msg1Result.error || !msg1Result.data) {
    console.error("FAILED to send parent message:", msg1Result.error);
    return;
  }
  console.log("SUCCESS: Sent message", msg1Result.data.id);

  // Step 3: Send a reply from the teacher
  console.log("\n[3/4] Sending reply from teacher...");
  const msg2Result = await sendMessage({
    conversationId: convo.id,
    senderId: "test-teacher-001",
    senderType: "TEACHER",
    senderName: "Test Teacher",
    body: "They are doing great! Keep up the good work at home.",
  });

  if (msg2Result.error || !msg2Result.data) {
    console.error("FAILED to send teacher message:", msg2Result.error);
    return;
  }
  console.log("SUCCESS: Sent message", msg2Result.data.id);

  // Step 4: Fetch all messages back
  console.log("\n[4/4] Fetching messages for conversation...");
  const messagesResult = await fetchMessages(convo.id);

  if (messagesResult.error || !messagesResult.data) {
    console.error("FAILED to fetch messages:", messagesResult.error);
    return;
  }

  console.log(`SUCCESS: Got ${messagesResult.data.length} messages:`);
  messagesResult.data.forEach((msg, i) => {
    console.log(`  [${i + 1}] ${msg.senderName}: "${msg.body}"`);
  });

  // Bonus: check that the conversation shows up in the parent's inbox
  console.log("\nBonus: Checking parent inbox...");
  const inboxResult = await fetchConversationsByParent("test-parent-001");
  if (inboxResult.data) {
    console.log(`Found ${inboxResult.data.length} conversation(s) in inbox`);
    inboxResult.data.forEach((c) => {
      console.log(`  - ${c.teacherName} | last: "${c.lastMessageText}"`);
    });
  }

  console.log("\n=== MESSAGING SMOKE TEST COMPLETE ===");
}
