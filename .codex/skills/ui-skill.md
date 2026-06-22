# Tailor UI Visual Implementation Skill

## Purpose

This skill defines the visual implementation rules for the Tailor frontend UI.

This skill never authorizes feature scope. It can only be applied after a feature spec has approved the related screen, flow or component.

It is based on the analysed PNG references from the Figma design.

It must be used to keep the interface visually consistent without needing to inspect Figma again.

This skill only defines visual and responsive implementation patterns.

Business rules, API contracts, authentication behavior, SWR usage, repository workflow and feature scope belong to `constitution.front.md` or approved feature specs.

If this skill conflicts with `constitution.front.md`, the constitution wins.

## Visual direction

The Tailor UI uses a dark-first style with strong blue branding.

The interface should feel:

* Modern.
* Clean.
* Rounded.
* Minimal.
* Visual.
* Easy to scan.
* Mobile-friendly.

Avoid heavy decoration.

Avoid pixel-perfect cloning.

Use the PNGs as a visual system, not as exact measurements.

## Color rules

Use a limited color palette.

Main visual direction:

* Main background: black or near-black.
* Main accent: Tailor blue.
* Main text on dark backgrounds: white.
* Secondary text: muted gray.
* Form card background: Tailor blue.
* Popup background: black.
* Light intro cards: white or near-white.
* Main borders: white on blue sections, blue on dark sections.

Do not introduce many extra colors.

Use additional colors only when needed for clear UI states.

## Typography rules

Use a bold, rounded, modern sans-serif feel.

Recommended hierarchy:

* Page title: large and bold.
* Section title: bold and clear.
* Card title: bold and readable.
* Labels: clear and medium weight.
* Body text: regular and readable.
* Helper text: smaller and secondary.
* Button text: bold.

Text must remain readable on small screens.

Avoid very low contrast for important text.

## Shape and spacing rules

The UI uses rounded shapes heavily.

Use:

* Large rounded cards.
* Rounded image corners.
* Pill buttons.
* Rounded form inputs.
* Spacious gaps.
* Clear separation between sections.

Avoid sharp, dense or cramped layouts.

Do not use excessive custom pixel values.

Prefer Tailwind spacing utilities and consistent visual rhythm.

## Logo usage

Use the Tailor logo as a brand anchor.

Recommended places:

* Home screen.
* Login screen.
* Register screens.
* Success popups.
* Error popups.
* Empty states when useful.

Do not recreate the logo with plain text if the asset exists.

Use the logo consistently and with enough breathing room.

## Responsive rules

Use mobile-first implementation.

Small screens:

* Single-column layout.
* Full-width forms.
* Full-width cards.
* Comfortable tap targets.
* Decorative images may be hidden.
* Main action should appear without excessive scrolling.

Medium screens:

* Slightly wider containers.
* Two-column layout only when readable.
* Better spacing and grouping.

Large screens:

* Split layouts are allowed.
* Wider visual image areas are allowed.
* Restaurant list and visual panels can appear side by side.
* Forms should remain compact and not stretch too much.

Do not create duplicated mobile and desktop components unless clearly needed.

Use simple Tailwind responsive prefixes such as `md:` and `lg:`.

Avoid many breakpoint-specific overrides.

## Tailwind style rules

Prefer simple Tailwind utilities.

Use:

* `flex`
* `grid`
* `gap-*`
* `rounded-*`
* `p-*`
* `px-*`
* `py-*`
* `max-w-*`
* `min-h-screen`
* `object-cover`
* `overflow-hidden`
* `border`
* `text-*`
* `bg-*`

Avoid:

* Excessive arbitrary values.
* Large custom CSS files.
* Absolute positioning for main page layout.
* Repeated long class strings across many components.
* Complex nested layout tricks.

## Home screen pattern

The home screen uses a split visual layout.

Visual structure:

* Black page background.
* Light intro card.
* Tailor logo inside the intro card.
* Short welcome copy.
* Primary action button.
* Large restaurant image area.
* Very rounded corners.

Desktop:

* Use two columns.
* Intro card on the left.
* Image area on the right.
* Image should feel visually dominant.

Mobile:

* Use one column.
* Keep the intro card first.
* Hide or move the image below.
* Keep the primary action visible and easy to tap.

Do not add extra onboarding steps unless approved elsewhere.

## Auth screen pattern

Auth screens use a strong blue card over a dark layout.

Visual structure:

* Black page background.
* Blue rounded form card.
* Tailor logo at the top.
* White outlined inputs.
* White pill primary button.
* Optional secondary/back action.
* Restaurant image on desktop.

Desktop:

* Split layout.
* Form card on the left.
* Large image on the right.
* Form card should stay compact.

Mobile:

* Blue form card becomes the main content.
* Image can be hidden.
* Inputs use full available width.
* Logo remains visible.
* Primary button stays easy to tap.

## Login visual pattern

Login screen should include:

* Tailor logo.
* Short heading.
* Email or username field.
* Password field.
* Primary submit button.
* Optional link to register.
* Clear visual error area.
* Loading/disabled button state.

Keep the form simple.

Do not add unnecessary explanatory text.

## Register visual pattern

Register uses the same auth visual language as login.

Register step 1:

* Tailor logo.
* Heading.
* Email input.
* Username input.
* Primary next button.
* Optional back/login action.

Register step 2:

* Tailor logo.
* Heading.
* Password input.
* Primary finish button.
* Back action.

Both steps:

* Blue rounded card.
* White outlined inputs.
* White pill button.
* Compact layout.
* Clear error area.

Do not make register visually different from login.

## Restaurant list screen pattern

The restaurant list uses a dark split layout.

Visual structure:

* Black background.
* Large visual/map area on the left.
* Restaurant list on the right.
* Restaurant cards stacked vertically.
* Blue rating marks.
* Rounded images.
* Clear card spacing.

Important:

Do not add a real map dependency just because the PNG shows a map-like area.

A static visual panel or placeholder is acceptable only when the related feature spec approves it.

Desktop:

* Use side-by-side layout.
* Visual/map area on the left.
* List on the right.
* List can scroll if needed.

Mobile:

* Prioritize the restaurant cards.
* Hide or move the visual/map area below.
* Use one-column cards.
* Keep cards easy to tap.

## Restaurant card pattern

Restaurant cards should be compact and visual.

Card content:

* Restaurant image.
* Restaurant name.
* Address or neighborhood when defined by the feature spec and backend contract.
* Cuisine type when defined by the feature spec and backend contract.
* Rating when available.
* Comments count when available.

Default layout:

* Image on the left.
* Text on the right.
* Rating near the lower text area.

Mobile alternative:

* Stack image above text if the horizontal layout becomes cramped.

Visual style:

* Dark card or dark page integration.
* Rounded image.
* Clear title.
* Muted secondary text.
* Tailor blue rating.

Selected or highlighted state:

* Slightly stronger contrast.
* Clear visual state.
* Do not rely only on color.

## Restaurant detail screen pattern

Restaurant detail uses an editorial dark layout.

Visual structure:

* Large hero image.
* Dark overlay if text appears over image.
* Centered restaurant name.
* Centered address or subtitle.
* Content below.
* Comments section below or beside main content.
* Reservation panel can appear as a side or lower section.

Desktop:

* Hero image spans wide.
* Main content can use two columns.
* Main column for information and comments.
* Side column for forms, reservation or actions.

Mobile:

* Hero image at the top.
* Content stacks vertically.
* Side panels move below.
* Avoid tiny columns.

Keep the detail page readable and calm.

## Restaurant information pattern

Restaurant information blocks should be clear and not overloaded.

Only include fields defined by the feature spec and backend contract.

Useful visual elements:

* Title.
* Address.
* Cuisine type.
* Description.
* Capacity or reservation-related information when defined by the feature spec and backend contract.
* Rating and comments count.

Use spacing to separate sections.

Avoid dense paragraphs.

## Comments section pattern

Comments use a minimal dark layout.

Visual structure:

* Comment form in a rounded dark card.
* Rating selector above textarea.
* Textarea with clear border.
* Pill submit button.
* Comments list below.
* Thin Tailor blue dividers between comments.
* Rating shown with Tailor blue marks.

Comment item:

* Author name.
* Rating.
* Date if available.
* Comment body.
* Edit/delete actions must only be shown when the related feature spec approves comment update/delete UI and the backend/user state confirms that the current user owns the comment.
* If ownership is unknown, edit/delete actions must not be rendered.
* Do not show edit/delete actions only because they fit visually in the design.

Mobile:

* Form full width.
* Comments stacked.
* Keep text readable.

## Rating visual pattern

Ratings use Tailor blue marks inspired by the PNGs.

Allowed implementations:

* Text symbols.
* Simple SVG icons.
* Reused Tailor-style mark if appropriate.

Rules:

* Keep ratings visually consistent across cards, detail and comments.
* Provide accessible text for rating meaning.
* Do not show a fake rating when no rating exists.
* Do not rely only on decorative symbols.

## Create restaurant screen pattern

Create restaurant uses a dark two-column form layout.

Visual structure:

* Black background.
* Image placeholder or preview area.
* Form area.
* Rounded fields.
* Tailor visual anchor.
* Pill primary button.

Desktop:

* Image area on the left.
* Form on the right.
* Form width remains readable.

Mobile:

* Image area above.
* Form below.
* Inputs full width.
* Submit button easy to tap.

Image area:

* Empty state with clear add image visual.
* Preview state with rounded image.
* Error state near the image field.

Do not invent upload behavior if the approved contract does not support it.

## Update restaurant screen pattern

Update restaurant reuses the create restaurant visual pattern.

Visual structure:

* Existing image or placeholder.
* Existing values shown in form fields.
* Save/update primary action.
* Optional delete or cancel action if approved.

Desktop:

* Keep the same two-column create layout.

Mobile:

* Stack image and form.

Do not visually redesign update as a separate experience.

## Favourite UI pattern

Favourite screens and states reuse restaurant cards.

Visual direction:

* Same dark page.
* Same card style.
* Saved state can use Tailor blue.
* Empty state can use logo/icon and short message.

Avoid creating a separate visual language for favourites.

## Reservation UI pattern

Reservation UI should feel like a clear panel inside restaurant detail.

Visual structure:

* Rounded dark panel.
* Date field.
* Party size field.
* Slot buttons.
* Confirm action.
* Clear disabled state for unavailable slots.

Slot buttons:

* Available: visually selectable.
* Selected: stronger blue or clear active state.
* Unavailable: muted, disabled and clearly not interactive.

Mobile:

* Panel full width.
* Slot buttons wrap in a simple grid.
* Confirm action easy to tap.

Do not make the reservation flow visually hidden or secondary.

## My reservations screen pattern

My reservations should use simple dark cards.

Card content:

* Restaurant name.
* Date.
* Time.
* Party size.
* Status.
* Action area when needed.

Visual rules:

* Status must be visible.
* Cancelled reservations should remain readable.
* Cancel action should be clear but not visually noisy.
* Empty state should be helpful.

Use one-column layout on mobile.

Use wider cards or two-column grid only if content remains readable.

## Popup pattern

Popups use a minimal Tailor visual style.

Visual structure:

* Black background or dark overlay.
* Centered dark card or full-screen state.
* Tailor blue icon/logo.
* Short title.
* Short message.
* Rounded outline button.

Use for:

* Restaurant created.
* Generic success.
* Something went wrong.
* Empty or blocked state when appropriate.

Do not overuse popups for every action.

Inline feedback is better for form validation.

## Error state pattern

Error states should be simple and readable.

Visual structure:

* Dark background.
* Tailor blue icon or accent.
* Short error title.
* Short explanation if useful.
* One clear recovery action.

Good examples:

* "Something went wrong."
* "Try again."
* "Go back."
* "Log in to continue."

Do not expose technical stack traces.

Do not show huge error blocks.

## Empty state pattern

Empty states should be calm and useful.

Visual structure:

* Dark card or dark page section.
* Optional Tailor icon.
* Short message.
* Optional single action.

Examples:

* No restaurants found.
* No comments yet.
* No favourite restaurants yet.
* No reservations yet.

Avoid long explanations.

## Loading state pattern

Use simple loading states.

Allowed patterns:

* Skeleton card.
* Loading text.
* Disabled pending button.
* Minimal spinner only if already available.

Every API-driven visual section should have a loading state.

Do not add a loading library only for this.

## Form visual rules

Forms should be simple and accessible.

Visual rules:

* Labels must be visible or accessible.
* Inputs should have rounded corners.
* Inputs should have clear borders.
* Inputs should have comfortable vertical padding.
* Errors appear near the related field.
* Primary action is visually clear.
* Disabled state is visible.

Auth forms:

* Blue background.
* White outlined inputs.
* White primary button.

Dark page forms:

* Dark card.
* Light text.
* Blue or white borders.
* Blue accent for focus/action.

## Button visual rules

Primary button:

* Pill shape.
* Strong contrast.
* Bold text.
* Clear hover/focus/disabled state.

Secondary button:

* Transparent or dark background.
* Border.
* Rounded pill.
* Less visual weight than primary.

Back button:

* Small pill or rounded rectangle.
* Border.
* Clear arrow or label.

Destructive button:

* Must be visually clear.
* Should not dominate unless the user is confirming a destructive action.

## Image rules

Images are central to the Tailor UI.

Rules:

* Use rounded corners.
* Use `object-cover`.
* Avoid distortion.
* Use fallback UI when image is missing.
* Use dark overlay if placing text over image.
* Decorative images can be hidden on small screens.
* Image loading failure must not break the main layout.

## Accessibility visual rules

Required visual accessibility:

* Clear focus states.
* Readable contrast.
* Visible labels or accessible labels.
* Buttons for actions.
* Links for navigation.
* Alt text for meaningful images.
* Empty alt text for decorative images.
* Disabled controls visibly disabled.
* Color must not be the only state indicator.
* Rating UI must include accessible text.

## Approved visual screen patterns

The analysed PNGs define these visual patterns:

1. Home screen.
2. Login screen.
3. Register step 1.
4. Register step 2.
5. Restaurant list.
6. Restaurant card.
7. Restaurant detail.
8. Restaurant information section.
9. Comment form.
10. Comments list.
11. Create restaurant.
12. Update restaurant.
13. Favourite restaurant cards.
14. Reservation panel.
15. My reservations cards.
16. Success popup.
17. Error popup.
18. Empty state.

Do not create new visual patterns unless an approved feature requires it.

Do not implement any of these patterns unless the related feature scope has already been approved in a spec.

This skill only guides how an approved UI should look and behave responsively.

## Final visual checklist

Before finishing a UI task, verify:

* The screen follows the dark-first Tailor style.
* Tailor blue is used consistently.
* Layout works on small, medium and large screens.
* Forms are readable and usable on mobile.
* Images are rounded and not distorted.
* Cards use consistent spacing and shape.
* Buttons have consistent visual hierarchy.
* Loading, empty and error states are visually covered.
* No pixel-perfect dependency was introduced.
* Tailwind classes remain simple and maintainable.
