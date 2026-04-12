import React from "react";
import { AssistantProfileChatModal } from "./AssistantProfileChatModal";

export type AssistantSetupModalProps = {
  visible: boolean;
  onCancel: () => void;
  onFlowComplete?: () => void;
};

export const AssistantSetupModal: React.FC<AssistantSetupModalProps> = (
  props
) => <AssistantProfileChatModal {...props} />;
