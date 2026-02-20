# TODO Remove Hero Slider Navigation Buttons

## Task: Remove all hero slider navigation buttons (prev/next arrows)

### Steps

- [x] 1. Analyze the codebase to understand hero slider implementation
- [x] 2. Remove unused CSS rules for .hero-prev and .hero-next
- [x] 3. Clean up JS references to prev/next buttons in HeroSliderManager classes
- [x] 4. Verify no console errors

### Details

- Hero slider buttons do NOT exist in HTML DOM
- CSS had `display: none !important` rules - REMOVED
- JS had prevBtn/nextBtn assignments and event bindings - CLEANED UP
- Slider auto-rotation still works (handled by interval)
- No buttons remain in DOM
- No JS references that could cause errors
