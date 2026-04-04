const CONVERSATION_SEPARATOR = "~";

export const buildConversationId = (
  otherUserId: string,
  propertyId: string,
) => `${otherUserId}${CONVERSATION_SEPARATOR}${propertyId}`;

export const parseConversationId = (conversationId?: string | null) => {
  if (!conversationId) {
    return { otherUserId: "", propertyId: "" };
  }

  const separatorIndex = conversationId.indexOf(CONVERSATION_SEPARATOR);

  if (separatorIndex === -1) {
    return { otherUserId: "", propertyId: "" };
  }

  return {
    otherUserId: conversationId.slice(0, separatorIndex),
    propertyId: conversationId.slice(separatorIndex + 1),
  };
};
