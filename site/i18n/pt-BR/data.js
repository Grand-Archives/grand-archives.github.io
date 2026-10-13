/* GrandArchives hub: content for pt-BR (Brazilian Portuguese).
 *
 * Translator's guide: copy this file to site/i18n/<code>/data.js and translate title, description and the
 * language part of url. Keep ids and colors identical in every language.
 *
 * cards  array of guides, shown in this order, each one:
 *   id           guide slug (the repository name); language-independent
 *   title        name of the guide
 *   description  one or two factual sentences
 *   url          absolute URL of the guide in THIS language (pt-BR: .../<id>/, en: .../<id>/en/)
 *   accent, accentDark    main color of the card in the light / dark theme (optional)
 *   accent2, accent2Dark  second color for a two-tone card edge (optional)
 *
 * Adding a guide: add one entry here and the same entry (translated) in every other language.
 */
export default {
  cards: [
    {
      id: "stephen-king",
      title: "O multiverso de Stephen King",
      description: "Mapa interativo de conexões com a Torre Negra no centro, sinopses de todos os livros e perfis de personagens, lugares e conceitos.",
      url: "https://grand-archives.github.io/stephen-king/",
      accent: "#ae2440", accentDark: "#ff8097"
    },
    {
      id: "middle-earth",
      title: "A Terra-média de Tolkien",
      description: "Mapa à moda antiga, linha do tempo das Eras e perfis de povos, línguas, personagens e lugares, com os livros onde cada história é contada.",
      url: "https://grand-archives.github.io/middle-earth/",
      accent: "#85640c", accentDark: "#e0b44a"
    },
    {
      id: "harry-potter",
      title: "O mundo bruxo de Harry Potter",
      description: "Casas e fundadores de Hogwarts, linha do tempo, criaturas, magia, quadribol e o que a autora acrescentou além dos sete livros.",
      url: "https://grand-archives.github.io/harry-potter/",
      accent: "#9a7a1c", accentDark: "#e0bf5a", accent2: "#a3232b", accent2Dark: "#ff7b82"
    },
    {
      id: "mcu",
      title: "O MCU sem maratona",
      description: "O que é preciso saber antes de Vingadores: Doomsday e toda a história dos filmes e séries da Marvel contada em ordem.",
      url: "https://grand-archives.github.io/mcu/",
      accent: "#1d7a47", accentDark: "#4fd07f"
    }
  ]
};
