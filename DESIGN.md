# Design direction

An editorial print spread crossed with a technical spec sheet.

## Dials

- Energy 2
- Rhythm 3
- Motion 2: hover, menu and viewer fades, one page transition. No scroll animations.

## Type

- Newsreader for headlines, at its large-display optical size.
- Schibsted Grotesk for text and interface.

Both come from news publishing.

## Color

Paper, ink and one red accent, the color of an editor's mark. The accent appears only on section numbers, focus, hover and the current page. Every text pairing passes WCAG AA in both themes. The tokens live in `src/styles/global.css`.

## Motif

Numbered section labels on thin rules, like magazine running heads. No rounded corners, shadows, gradients or glow.

## Composition

Every section is laid out differently:

- Hero: a large name, with the role and intro set asymmetrically below it.
- Selected work: a full-width lead project, then a staggered wide/narrow grid.
- Work index: a contents-style list.
- Experience: a table with the years in the left column.
- Contact: the email address set very large.
