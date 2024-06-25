import { Box } from "@mui/material";
import ChatImage from "../../src/assets/icons/chat.svg";

export default function ChatFloatingIcon() {
  return (
    <Box className="chat-floating-icon">
      <img src={ChatImage} alt="" height={65} width={65} />
    </Box>
  );
}
