# Group splitter

Group splitter is a tool for workshop facilitators to easily prepare name tags in a way that enables spontantenous coordination of the participants into various smaller groups in a very convenient and fast way.

It comes down to a very simple idea: each name tag has a number tag inside a geometrical shape, with a specific background color to it.

Using the number, color, and shape, it's possible to quickly call people in various smaller groups. For example: "Participants, find a group with same number!", or "...with same geometrical shape!", or "...with same number tag color!".

The app is used when preparing for the workshop. The facilitator knows in advance the participant names.

## User stories

User can add participants by pasting a list of names in a textarea. Each row represents a participant name.

There are 3 permutations (=splits to sub groups), user can choose how many sub groups in each permutation there are:

- Largest number of sub groups uses numbers as the key (1, 2, 3, 4, 5, 6, 7, 8, etc.)
- second largest uses color as the key (red, green, orange, blue, yellow, teal, pink)
- smallest uses shapes (circle, square, triangle, hexagon)

User sees how the subgroups are formed based on the configurations.

User sees a list of name tags where in each there's:

- Name
- Number on a geometrical shape with a particular background color for the shape

User can reset everything by removing the participan names from the textarea. Small group configurations can be altered regardless of how many participants are provided.

## Architecture

Use theme object that determines all colors and sizes first as design tokens and then assigned to component tokens that determine where those colors and sizes are to be used. This way it's possible to change the app theme from one file.

## Tech

- React
- TypeScript
- Vite
