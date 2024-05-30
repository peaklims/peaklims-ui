import { useEffect, useState } from "react";

export function useActionButtonKey() {
  return useActionButton()[0];
}

export function useActionButtonName() {
  return useActionButton()[1];
}

export function useActionButton() {
  const ACTION_KEY_DEFAULT = ["Ctrl", "Control"];
  const ACTION_KEY_APPLE = ["⌘", "Command"];

  const [actionKey, setActionKey] = useState(ACTION_KEY_DEFAULT);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      // depricated but acceptable for this use case https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform#examples
      if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
        setActionKey(ACTION_KEY_APPLE);
      } else {
        setActionKey(ACTION_KEY_DEFAULT);
      }
    }
  }, []);

  return actionKey;
}
