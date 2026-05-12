export const CharacterSpritePaths = [
  '/tiles/characters/barbarian_male_n.png',
  '/tiles/characters/barbarian_male_e.png',
  '/tiles/characters/barbarian_male_s.png',
  '/tiles/characters/barbarian_male_w.png',
  '/tiles/characters/dwarf_male_n.png',
  '/tiles/characters/dwarf_male_e.png',
  '/tiles/characters/dwarf_male_s.png',
  '/tiles/characters/dwarf_male_w.png',
  '/tiles/characters/elf_male_n.png',
  '/tiles/characters/elf_male_e.png',
  '/tiles/characters/elf_male_s.png',
  '/tiles/characters/elf_male_w.png',
  '/tiles/characters/wizard_male_n.png',
  '/tiles/characters/wizard_male_e.png',
  '/tiles/characters/wizard_male_s.png',
  '/tiles/characters/wizard_male_w.png',
] as const;

export type CharacterSpritePaths = (typeof CharacterSpritePaths)[number];
