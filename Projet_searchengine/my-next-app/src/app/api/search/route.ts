import { NextRequest, NextResponse } from 'next/server'

// Hardcoded patent data
const patents = [
  {
    id: "US11856973",
    title: "Artificial Intelligence System for Natural Language Processing",
    abstract: "An advanced system utilizing machine learning algorithms to process and understand human language patterns.",
    inventors: ["Sarah Johnson", "Michael Chen"]
  },
  {
    id: "US11856123",
    title: "Quantum Computing Architecture",
    abstract: "A novel approach to quantum computing that reduces decoherence and improves qubit stability.",
    inventors: ["David Smith", "Elena Rodriguez"]
  },
  {
    id: "US11855789",
    title: "Renewable Energy Storage Solution",
    abstract: "An innovative battery technology for storing renewable energy with improved efficiency.",
    inventors: ["James Wilson", "Lisa Zhang"]
  },
  {
    id: "US11854567",
    title: "Smart Healthcare Monitoring Device",
    abstract: "A wearable device that continuously monitors vital signs and predicts potential health issues.",
    inventors: ["Robert Brown", "Maria Garcia"]
  },
  {
    id: "US11853456",
    title: "Autonomous Vehicle Navigation System",
    abstract: "An advanced navigation system for self-driving vehicles using computer vision and sensor fusion.",
    inventors: ["Thomas Anderson", "Emily White"]
  }
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ 
      success: true,
      data: patents,
      count: patents.length 
    })
  }

    // Filter patents based on search query
    const filteredPatents = patents.filter(patent => 
      patent.title.toLowerCase().includes(query.toLowerCase()) ||
      patent.abstract.toLowerCase().includes(query.toLowerCase()) ||
      patent.inventors.some(inventor => 
        inventor.toLowerCase().includes(query.toLowerCase())
      )
    )

    return NextResponse.json({ 
      success: true,
      data: filteredPatents,
      count: filteredPatents.length 
    })

 
}

