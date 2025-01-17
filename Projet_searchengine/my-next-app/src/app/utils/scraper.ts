import * as cheerio from 'cheerio'

interface Patent {
  id: string
  title: string
  abstract: string
  inventors: string[]
}

export async function scrapePatents(query: string): Promise<Patent[]> {
  const url = `http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=0&f=S&l=50&TERM1=${encodeURIComponent(query)}&FIELD1=&co1=AND&TERM2=&FIELD2=&d=PTXT`

  try {
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const html = await response.text()

    const $ = cheerio.load(html)
    const patents: Patent[] = []

    $('table').each((_, table) => {
      const $table = $(table)
      if ($table.find('th').text().includes('PAT. NO.')) {
        $table.find('tr').slice(1).each((_, row) => {
          const $columns = $(row).find('td')
          if ($columns.length >= 3) {
            const id = $columns.eq(1).text().trim()
            const title = $columns.eq(2).text().trim()
            patents.push({ id, title, abstract: '', inventors: [] })
          }
        })
      }
    })

    if (patents.length === 0) {
      throw new Error('No patents found')
    }

    // Fetch additional details for each patent
    for (const patent of patents) {
      const detailUrl = `http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=${patent.id}.PN.&OS=PN/${patent.id}&RS=PN/${patent.id}`
      const detailResponse = await fetch(detailUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
      })
      if (!detailResponse.ok) {
        throw new Error(`HTTP error! status: ${detailResponse.status}`)
      }
      const detailHtml = await detailResponse.text()
      const $detail = cheerio.load(detailHtml)

      patent.abstract = $detail('p:contains("Abstract")').next().text().trim()
      patent.inventors = $detail('th:contains("Inventors:")').next().text().split(';').map(inventor => inventor.trim())
    }

    return patents
  } catch (error) {
    console.error('Error in scrapePatents:', error)
    throw error
  }
}

