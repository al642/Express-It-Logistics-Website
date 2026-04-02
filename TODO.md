# Express It Logistics - Mobile UI Enhancements TODO

Status: 🚀 In Progress (BLACKBOXAI)

## Task 1: Team Cards - Mobile Individual Expand/Retract ✅

- [✅] Step 1.1: Add mobile-specific CSS to `css/styles.css` for touch + expanded states
- [✅] Step 1.2: Enhance `js/main.js` `initTeamCardExpansion()` for exclusive expand (remove .expanded from siblings)
- [✅] Step 1.3: Test mobile: Tap card → expands only that one; tap another → previous retracts, new expands

## Task 2: Hamburger Menu - Footer Quicklinks Behavior ✅

- [✅] Step 2.1: Add CSS animations to `css/styles.css` for `#mobile-menu.open .mobile-nav-link` (staggered slide-in like footer)
- [✅] Step 2.2: Match hover effects: `padding-left + ::after` pink dot on `.mobile-nav-link:hover`
- [⚠️] Step 2.3: Update `js/main.js` menu toggle (CSS nth-child handles stagger, no JS change needed)
- [✅] Step 2.4: Test: Toggle hamburger → links slide in staggered; hover → footer-like animation

## Task 3: Dark/Light Toggle Polish ✅

- [✅] Step 3.1: Minor CSS `.dark-mode-toggle` active feedback (scale/rotate)
- [✅] Step 3.2: Verify both desktop/mobile sync + localStorage (existing good)

**Status: COMPLETE 🎉**

- Mobile team: Individual tap expand, exclusive (one only).
- Hamburger: Staggered footer-quicklinks animation + hover.
- Theme: Browser-like toggle both desktop/mobile.

**Demo:** Open `pages/team.html` → DevTools mobile → Tap cards/hamburger/theme. Reload pages to test.
