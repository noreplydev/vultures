import * as cheerio from 'cheerio';

export const getCveExtradata = async (cveId) => {
  const id = cveId.toUpperCase()
  const response = await fetch("https://github.com/search?q=" + id + "%20poc&type=repositories")
  const html = await response.text()
  const HTML = cheerio.loadBuffer(html)
  const reposList = HTML('[data-testid="results-list"]')
  const rawPocs = []
  reposList.children().each((i, ele) => {
    const repoBox = HTML(ele)
    const linkTags = repoBox.find(".prc-Link-Link-85e08")
    linkTags.each((i, tag) => {
      if (!tag.attribs.href) return
      if (tag.attribs.href && tag.attribs.href.startsWith("/topics")) return
      if (tag.attribs.href && tag.attribs.href.endsWith("/stargazers")) return
      rawPocs.push(tag.attribs.href)
    })
  });
  const pocs = rawPocs.map(poc => "https://github.com" + poc).slice(0, 3) // limit to 3 for the moment

  return { pocs }
}