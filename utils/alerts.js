import { Alert, Platform } from "react-native";

// Exibe um alerta simples (título + mensagem)
export function showAlert(title = "", message = "") {
  if (Platform.OS === "web") {
    try {
      // Usa o alert do navegador no web
      window.alert(`${title ? title + "\n\n" : ""}${message}`);
    } catch {
      console.log("[Alert:web]", title, message);
    }
  } else {
    Alert.alert(title, message);
  }
}

// Exibe confirmação com Cancelar/OK.
// Em web usa window.confirm; em nativo usa Alert com dois botões.
export function confirm(title = "", message = "", onConfirm, options = {}) {
  const cancelText = options.cancelText || "Cancelar";
  const confirmText = options.confirmText || "OK";
  const confirmStyle = options.confirmStyle || "default"; // 'default' | 'destructive'

  if (Platform.OS === "web") {
    try {
      const ok = window.confirm(`${title ? title + "\n\n" : ""}${message}`);
      if (ok) onConfirm && onConfirm();
    } catch {
      // Fallback: loga e executa confirmação
      console.log("[Confirm:web]", title, message);
      onConfirm && onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: cancelText, style: "cancel" },
      { text: confirmText, style: confirmStyle, onPress: () => onConfirm && onConfirm() },
    ]);
  }
}