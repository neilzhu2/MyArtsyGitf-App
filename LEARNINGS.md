# MyArtsyGift App — Project Learnings & Architectural Rules

This file documents critical bugs encountered, their verified root causes, and mandatory architectural rules to prevent regressions. Always consult this file before building or refactoring modal screens, keyboard-adjacent interfaces, layout insets, or state flows.

---

## 🟦 RULE 1 — Keyboard Handling: The One True Pattern (Do Not Reinvent Per Screen)

### Symptom & Root Cause
React Native's `KeyboardAvoidingView` does NOT work reliably inside Modals, BottomSheets, or nested Stack screens on iOS. It fails to compute layout tree offsets inside separate presentation windows, causing the software keyboard to completely obscure text inputs.

### The Mandatory Pattern
Every screen or modal with a text input MUST use the hand-rolled `Keyboard` frame listener + Modal-aware `ScrollView` props:

1. **Listen for the Real Keyboard Frame**:
   ```tsx
   const [keyboardPad, setKeyboardPad] = useState(0);

   useEffect(() => {
     const showSub = Keyboard.addListener(
       Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
       e => setKeyboardPad(e.endCoordinates.height)
     );
     const hideSub = Keyboard.addListener(
       Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
       () => setKeyboardPad(0)
     );
     return () => {
       showSub.remove();
       hideSub.remove();
     };
   }, []);
   ```

2. **Apply `keyboardPad` to the Bottom Input Bar Container**:
   ```tsx
   <View style={[
     styles.inputBar, 
     { paddingBottom: keyboardPad > 0 ? keyboardPad : Math.max(insets.bottom, 12) }
   ]}>
   ```

3. **Configure the `ScrollView` for Modal-Aware Scroll Adjustment**:
   ```tsx
   <ScrollView
     ref={scrollViewRef}
     automaticallyAdjustKeyboardInsets
     keyboardShouldPersistTaps="handled"
   >
   ```

4. **Auto-Scroll to End on Keyboard Reveal**:
   ```tsx
   useEffect(() => {
     if (keyboardPad > 0) {
       setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
     }
   }, [keyboardPad]);
   ```

---

## 🟦 RULE 2 — Modal Header Top Safe Area Insets (Prevent Double-Padding)

### Symptom & Root Cause
In Expo Router modal stack screens (`presentation: 'modal'`), iOS automatically handles modal card top corners and window offsets. Adding `insets.top` (e.g. `Math.max(insets.top, 16)`) to the header's `paddingTop` creates a massive blank white gap above the header bar.

### The Mandatory Pattern
1. **Modal Header Bar**: Use tight, fixed vertical padding (`paddingVertical: 12` or `paddingTop: 12, paddingBottom: 12`) for modal headers. Do NOT stack manual `insets.top` on top of modal window frames.
2. **Main Tab Screens**: Wrap root views in `<SafeAreaView edges={['top']}>` and render `<Header />` without adding `insets.top` inside the header component itself.

---

## 🟦 RULE 3 — Single-Owner Logic & Router Navigation

### Symptom & Root Cause
Triggers (such as FAB buttons or AI banners) that update Zustand store state (e.g. `isOpen: true`) without calling `router.push('/(modals)/ai-assistant')` cause silent state updates with no visible UI transition (user sees "no effect").

### The Mandatory Pattern
All trigger handlers MUST combine store state initialization AND explicit Expo Router navigation:
```tsx
const handlePress = async () => {
  await openAiAssistant(context);
  router.push('/(modals)/ai-assistant');
};
```

---

## 🟦 RULE 4 — i18n Key Resolution & Bundle Reloads

### Symptom & Root Cause
When new translation keys are added to `en.json` / `zh.json`, Metro Fast Refresh does not re-initialize `i18next`. New keys may display as literal path strings (`aiModal.title`).

### The Mandatory Pattern
After adding or modifying i18n translation keys, perform a full bundle reload (`r` in Metro terminal).
