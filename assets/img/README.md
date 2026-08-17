# Photos

Drop your images in this folder using **exactly these filenames**. The site
picks them up automatically — no code changes needed.

| Filename | Where it appears | Best crop |
|---|---|---|
| `founder.jpg` | Homepage founder section, About/team card | Square or 4:5 portrait |
| `founder-office.jpg` | About page, "Origin" section | 4:5 portrait or 3:4 |
| `logo-wall.jpg` | Homepage, next to the positioning copy | Landscape, 16:9 |
| `team-2.jpg` … `team-4.jpg` | About page team grid | 4:5 portrait |

From the three photos you sent:

- The suited outdoor portrait → save as **`founder.jpg`**
- The photo of you standing under the HashFunds signage → save as **`founder-office.jpg`**
- The close-up of the HashFunds wall lettering → save as **`logo-wall.jpg`**

Until a file exists, that slot renders a labelled diagonal-stripe placeholder
telling you which filename is missing — nothing breaks.

## Watch out for double extensions

Windows hides known file extensions by default, so renaming a file to
`founder.jpg` can silently save it as `founder.jpg.jpeg` — and the site won't
find it. In File Explorer turn on **View → Show → File name extensions** before
renaming, and check the real name afterwards.

## Notes

- Everything is converted to greyscale in CSS (`filter: grayscale(1)`), so you
  can upload the original colour files. Don't pre-convert them.
- Keep each file under ~400 KB. Export at roughly 1600px on the long edge —
  larger than that is wasted on a web page and just slows the site down.
- `.jpg` for photographs, `.png` only if you need transparency.
