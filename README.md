# Lab 7 - Starter

**Name:** Ajay Anubolu
**Partner:** none (solo)

## Test Results
See `test-results.png` for screenshot of all 9 Puppeteer tests passing locally via `npm test`.

## Check Your Understanding

**1) Where would you fit your automated tests in your Recipe project development pipeline?**

> 1. Within a GitHub action that runs whenever code is pushed
> 2. Manually run them locally before pushing code
> 3. Run them all after all development is completed

**Answer: 1. Within a GitHub action that runs whenever code is pushed.**

Automated tests are only useful if they're *actually run*. Relying on developers to remember to run them locally (option 2) means tests get skipped when someone is rushing or distracted. Running them only at the end (option 3) defeats the purpose of testing. By the time you discover a regression you've layered five more features on top of it, and bisecting becomes painful. A GitHub Action on every push enforces the discipline at the platform level. You catch regressions immediately, while the change is small and the context is fresh.

**2) Would you use an end-to-end test to check if a function is returning the correct output? (yes/no)**

**No.** E2E tests spin up a real browser, navigate to a URL, click DOM elements, and observe rendered output. That's unnecessary overhead for a question of "given these inputs, do I get this output?" A unit test calls the function directly, asserts on the return value, runs in milliseconds, and is deterministic. E2E tests exist for things you cannot verify any other way: did the button text actually swap, did the cart count update, did localStorage persist across reload. Pure functions don't need that machinery.

**3) What is the difference between navigation and snapshot mode?**

**Navigation mode** audits a fresh page load: Lighthouse opens the URL, measures load metrics (First Contentful Paint, Largest Contentful Paint, Total Blocking Time, Cumulative Layout Shift), and grades overall performance from cold start. It's the right mode for answering *"how fast does this site load for a new visitor?"* but it can't see anything that depends on user interaction.

**Snapshot mode** audits the page **in its current state**: whatever DOM is on screen at the moment you click Analyze, including state you've built up by interacting. It doesn't measure load performance , but it's the right tool for auditing accessibility issues that only appear after interactions (open modals, expanded menus, post-form-submit states).

**4) Name three things we could do to improve the CSE 110 shop site based on the Lighthouse results.**

Our audit returned Performance 100, Accessibility 90, Best Practices 100, SEO 91. The specific failures Lighthouse flagged were:

1. **Add a `lang` attribute to the `<html>` element** (Accessibility fix). The audit reported "`<html>` element does not have a `[lang]` attribute". Screen readers use this to pick the correct pronunciation and voice for the page. 
2. **Add a `<meta name="description">` tag** (SEO fix). The audit reported "Document does not have a meta description". Search engines use this string as the snippet under the page title in results.
3. **Minimize and reduce unused JavaScript** (Performance diagnostics flagged ~58 KiB and ~59 KiB of savings respectively, even though the overall Performance score was 100). Minimize strips whitespace, comments, and shorten identifiers; remove unused code paths (cart/checkout logic on the home page).
