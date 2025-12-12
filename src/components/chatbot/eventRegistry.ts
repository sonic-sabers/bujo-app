export const eventRegistry: Record<
  string,
  ((payload?: unknown) => void) | undefined
> = {
  formSubmitDemo: (payload) => {
    if (typeof window !== "undefined") {
      window.alert(`Submitted: ${JSON.stringify(payload)}`);
    }
  },
  resetDemo: () => {
    if (typeof window !== "undefined") {
      window.alert("Form reset");
    }
  },
  likeDemo: (payload) => {
    if (typeof window !== "undefined") {
      window.alert(`Liked: ${JSON.stringify(payload)}`);
    }
  },
};
