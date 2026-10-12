// ATLAS assessment data (shared by index.html and modules.html)
const examModules = [
            {
                id: "mod-main",
                main: true,
                title: "Comprehensive Abstracting",
                description: "A three-part licensure-style assessment covering Abstracting Knowledge, Abstracting Skills, and Challenges in Abstracting, with ten multiple-choice items per part.",
                parts: [
                    "Abstracting Knowledge",
                    "Abstracting Skills",
                    "Challenges in Abstracting"
                ],
                questions: [
                    {
                        id: "main-1",
                        part: "Abstracting Knowledge",
                        category: "Nature of Abstracts",
                        text: "What is an abstract?",
                        options: [
                            "A verbatim excerpt taken from a document's conclusion",
                            "A brief, objective representation of a document's essential content",
                            "A personal evaluation of a document's argument",
                            "A list of subject keywords assigned to a document"
                        ],
                        answer: 1,
                        explanation: "An abstract condenses the essential content of a document in a brief, objective manner so users can judge relevance without reading the full text."
                    },
                    {
                        id: "main-2",
                        part: "Abstracting Knowledge",
                        category: "Authorship",
                        text: "An abstract prepared by the creator of the original document is called a(n) ______.",
                        options: ["Indicative abstract", "Critical abstract", "Author abstract", "Slanted abstract"],
                        answer: 2,
                        explanation: "An author abstract is written by the creator of the primary document, as opposed to one prepared by a professional abstractor."
                    },
                    {
                        id: "main-3",
                        part: "Abstracting Knowledge",
                        category: "Types of Abstracts",
                        text: "Which type of abstract briefly describes what a document covers without reporting its results or conclusions?",
                        options: ["Informative abstract", "Critical abstract", "Structured abstract", "Indicative (descriptive) abstract"],
                        answer: 3,
                        explanation: "An indicative or descriptive abstract states the scope and coverage of a document but does not summarize findings."
                    },
                    {
                        id: "main-4",
                        part: "Abstracting Knowledge",
                        category: "Purpose of Abstracts",
                        text: "What is the main purpose of an abstract in an indexing and abstracting service?",
                        options: [
                            "To help users decide whether a document is relevant without reading the full text",
                            "To replace the original document completely",
                            "To record the copyright status of a document",
                            "To list every reference cited in a document"
                        ],
                        answer: 0,
                        explanation: "Abstracts support relevance judgments and save readers' time by summarizing the content of documents."
                    },
                    {
                        id: "main-5",
                        part: "Abstracting Knowledge",
                        category: "Types of Abstracts",
                        text: "Which type of abstract presents the purpose, methods, results, and conclusions of a document in a condensed, self-contained form?",
                        options: ["Indicative abstract", "Critical abstract", "Informative abstract", "Slanted abstract"],
                        answer: 2,
                        explanation: "An informative abstract conveys the substantive findings and conclusions of a document, not merely its coverage."
                    },
                    {
                        id: "main-16",
                        part: "Abstracting Knowledge",
                        category: "Standards",
                        text: "Which international standard provides guidelines for the preparation of abstracts for publications and documentation?",
                        options: ["ISO 2709", "ISO 639", "ISO 214", "ISO 9001"],
                        answer: 2,
                        explanation: "ISO 214 gives guidelines for the preparation and presentation of abstracts for publications and documentation."
                    },
                    {
                        id: "main-17",
                        part: "Abstracting Knowledge",
                        category: "Types of Abstracts",
                        text: "An abstract that includes the abstractor's own evaluation or judgment of a document is called a:",
                        options: ["Informative abstract", "Critical (evaluative) abstract", "Indicative abstract", "Telegraphic abstract"],
                        answer: 1,
                        explanation: "A critical or evaluative abstract adds the abstractor's assessment of the document's quality or validity."
                    },
                    {
                        id: "main-18",
                        part: "Abstracting Knowledge",
                        category: "Structured Abstracts",
                        text: "In a structured abstract, which heading states the research problem or aim of the study?",
                        options: ["Methodology", "Results", "Objective (purpose)", "Conclusion"],
                        answer: 2,
                        explanation: "The objective or purpose heading of a structured abstract states the aim or research problem."
                    },
                    {
                        id: "main-19",
                        part: "Abstracting Knowledge",
                        category: "Abstracting Services",
                        text: "What is the main function of an abstracting and indexing (A&I) service?",
                        options: [
                            "To publish the full text of every document it indexes",
                            "To organize and provide access to condensed summaries of published literature",
                            "To host the raw research datasets of authors",
                            "To certify the peer-review status of journals"
                        ],
                        answer: 1,
                        explanation: "An A&I service organizes and provides access to abstracts and index terms for the literature of a field."
                    },
                    {
                        id: "main-20",
                        part: "Abstracting Knowledge",
                        category: "Coverage",
                        text: "In indexing and abstracting practice, what does the 'coverage' of a service refer to?",
                        options: [
                            "The number of pages in each abstract",
                            "The reading level of the abstracts",
                            "The physical shelf space the collection occupies",
                            "The proportion of the literature in a field that the service abstracts"
                        ],
                        answer: 3,
                        explanation: "Coverage describes how completely a service abstracts the relevant literature of a field."
                    },
                    {
                        id: "main-6",
                        part: "Abstracting Skills",
                        category: "Content Selection",
                        text: "When condensing a document, which elements should an abstractor prioritize?",
                        options: [
                            "Acknowledgements and funding statements",
                            "Purpose, methods, results, and conclusions",
                            "Every reference in the bibliography",
                            "The author's institutional affiliation"
                        ],
                        answer: 1,
                        explanation: "These core elements capture the document's essential contribution and are the priority of a good abstract."
                    },
                    {
                        id: "main-7",
                        part: "Abstracting Skills",
                        category: "Writing Style",
                        text: "Which practice should an abstractor follow when representing the author's original wording?",
                        options: [
                            "Copy sentences verbatim to avoid distortion",
                            "Insert personal opinions to add value",
                            "Rewrite the conclusion as a critique",
                            "Paraphrase in clear, concise language while preserving the original meaning"
                        ],
                        answer: 3,
                        explanation: "Abstractors should use their own concise language without altering the author's intended meaning."
                    },
                    {
                        id: "main-8",
                        part: "Abstracting Skills",
                        category: "Conventions",
                        text: "How should unfamiliar abbreviations or acronyms be handled in an abstract?",
                        options: [
                            "Spell them out in full at first mention",
                            "Use them freely without explanation",
                            "Omit the underlying concept entirely",
                            "Replace them with vague synonyms"
                        ],
                        answer: 0,
                        explanation: "An abstract must stand alone, so abbreviations should be defined at first use."
                    },
                    {
                        id: "main-9",
                        part: "Abstracting Skills",
                        category: "Condensation",
                        text: "In abstracting, condensation primarily involves:",
                        options: [
                            "Removing all numerical data from the abstract",
                            "Limiting every sentence to five words or fewer",
                            "Reducing content to its essential information while retaining accuracy",
                            "Translating the abstract into another language"
                        ],
                        answer: 2,
                        explanation: "Condensation means expressing the same essential content more briefly without distortion."
                    },
                    {
                        id: "main-10",
                        part: "Abstracting Skills",
                        category: "Objectivity",
                        text: "Which practice best keeps an abstract objective?",
                        options: [
                            "Highlighting only findings that support the abstractor's views",
                            "Reporting the document's content without inserting the abstractor's own judgment",
                            "Adding recommendations for future research",
                            "Comparing the document with competing works"
                        ],
                        answer: 1,
                        explanation: "Objectivity requires presenting the author's content faithfully and neutrally."
                    },
                    {
                        id: "main-21",
                        part: "Abstracting Skills",
                        category: "Reading and Extraction",
                        text: "Which parts of a research article are the most productive sources for drafting a first abstract?",
                        options: [
                            "The reference list",
                            "The abstract, introduction, and conclusion, supplemented by the results",
                            "The acknowledgements and appendix only",
                            "The journal's front matter"
                        ],
                        answer: 1,
                        explanation: "These sections state the problem, approach, and findings that an abstract must convey."
                    },
                    {
                        id: "main-22",
                        part: "Abstracting Skills",
                        category: "Time Management",
                        text: "Which workflow practice helps an abstractor produce an accurate abstract?",
                        options: [
                            "Waiting several months so the details fade",
                            "Abstracting only the title and skipping the body",
                            "Drafting the abstract soon after reading the document, while the content is fresh",
                            "Delegating the abstract to the author"
                        ],
                        answer: 2,
                        explanation: "Working from a fresh reading reduces omissions and misstatements."
                    },
                    {
                        id: "main-23",
                        part: "Abstracting Skills",
                        category: "Language and Style",
                        text: "Which sentence style is most appropriate for an abstract?",
                        options: [
                            "Second-person commands addressed to the reader",
                            "Complete, concise sentences in the third person, using past tense for methods and results",
                            "Long, ornate sentences that build suspense",
                            "Randomly mixed tenses to add variety"
                        ],
                        answer: 1,
                        explanation: "Abstracts use concise, impersonal, and consistent language."
                    },
                    {
                        id: "main-24",
                        part: "Abstracting Skills",
                        category: "Accuracy",
                        text: "When a document reports statistically non-significant results, the abstract should:",
                        options: [
                            "Report the findings as if they were significant",
                            "Omit the results section entirely",
                            "Replace the statistics with vague praise",
                            "State the findings accurately, including the absence of significance"
                        ],
                        answer: 3,
                        explanation: "Accuracy requires reporting the results as they are, including non-significant findings."
                    },
                    {
                        id: "main-25",
                        part: "Abstracting Skills",
                        category: "Editing",
                        text: "In the final editing pass, an abstractor should check that the abstract:",
                        options: [
                            "Repeats the title word for word",
                            "Includes the abstractor's name and affiliation",
                            "Stands alone and is fully understandable without the source document",
                            "Uses as many direct quotations as possible"
                        ],
                        answer: 2,
                        explanation: "An abstract must be self-contained because readers often see only the abstract."
                    },
                    {
                        id: "main-11",
                        part: "Challenges in Abstracting",
                        category: "Technical Terminology",
                        text: "Which is a common challenge when abstracting highly specialized or technical documents?",
                        options: [
                            "Interpreting discipline-specific terminology without misrepresenting the content",
                            "Finding documents with enough pages",
                            "Avoiding the use of nouns",
                            "Spending too little time reading"
                        ],
                        answer: 0,
                        explanation: "Subject-specific vocabulary can be difficult to interpret correctly, risking distortion of the author's meaning."
                    },
                    {
                        id: "main-12",
                        part: "Challenges in Abstracting",
                        category: "Completeness Limits",
                        text: "What is a major limitation of abstracts in research retrieval?",
                        options: [
                            "They are always longer than the source document",
                            "They cannot be indexed by search engines",
                            "They are never written in English",
                            "They may omit nuances and details found in the full document"
                        ],
                        answer: 3,
                        explanation: "By condensing, abstracts inevitably leave out detail, so they cannot fully substitute for the source document."
                    },
                    {
                        id: "main-13",
                        part: "Challenges in Abstracting",
                        category: "Multilingual Abstracting",
                        text: "Abstracting services that cover foreign-language documents face which challenge?",
                        options: [
                            "Hiring staff who read only one language",
                            "Maintaining terminological consistency and accuracy across translations",
                            "Storing documents in multiple formats",
                            "Keeping abstracts below fifty words"
                        ],
                        answer: 1,
                        explanation: "Translation can introduce terminological inconsistencies and subtle shifts in meaning."
                    },
                    {
                        id: "main-14",
                        part: "Challenges in Abstracting",
                        category: "Subjectivity",
                        text: "Which risk arises when an abstractor's personal judgment shapes the summary?",
                        options: [
                            "Faster completion of the abstract",
                            "Improved objectivity of the abstract",
                            "Bias that distorts the author's intended meaning",
                            "Greater coverage of the literature"
                        ],
                        answer: 2,
                        explanation: "Subjectivity introduces bias, undermining the abstract's objectivity and reliability."
                    },
                    {
                        id: "main-15",
                        part: "Challenges in Abstracting",
                        category: "Editorial Constraints",
                        text: "What resource challenge do abstracting services commonly face?",
                        options: [
                            "The cost and time required to abstract a growing volume of literature",
                            "A shortage of documents to abstract",
                            "Excess unused storage space",
                            "Too few potential readers"
                        ],
                        answer: 0,
                        explanation: "Abstracting is labor-intensive and costly, and services struggle to cover rapidly growing output."
                    },
                    {
                        id: "main-26",
                        part: "Challenges in Abstracting",
                        category: "Standardization",
                        text: "Why is the absence of a single universal abstracting standard a challenge?",
                        options: [
                            "It makes abstracts longer than the source articles",
                            "Abstracts vary in structure and depth across services, complicating comparison and retrieval",
                            "It prevents authors from publishing",
                            "It removes the need for subject indexing"
                        ],
                        answer: 1,
                        explanation: "Inconsistent formats and depth make it harder to compare or uniformly retrieve abstracts."
                    },
                    {
                        id: "main-27",
                        part: "Challenges in Abstracting",
                        category: "Timeliness",
                        text: "What is the 'currency' challenge facing abstracting services?",
                        options: [
                            "Abstracts are published before the original articles",
                            "Delays between publication and the appearance of the abstract reduce its usefulness",
                            "Abstracts never record dates",
                            "Older documents are always preferred"
                        ],
                        answer: 1,
                        explanation: "Lag between publication and abstracting diminishes the value of the abstract for current awareness."
                    },
                    {
                        id: "main-28",
                        part: "Challenges in Abstracting",
                        category: "Copyright and Ethics",
                        text: "Why can reproducing published abstracts raise legal concerns?",
                        options: [
                            "Abstracts may be protected by copyright, so permission or licensing may be required",
                            "Abstracts are always in the public domain",
                            "Copyright applies only to printed books",
                            "Abstracts contain no intellectual property"
                        ],
                        answer: 0,
                        explanation: "Abstracts are protected works, so reuse may require permission or a licence."
                    },
                    {
                        id: "main-29",
                        part: "Challenges in Abstracting",
                        category: "Evaluation",
                        text: "Which difficulty arises when an abstractor must judge which findings matter most?",
                        options: [
                            "All findings are always equally important",
                            "Importance is determined objectively by page count",
                            "Selecting emphasis can reflect the abstractor's bias rather than the author's priorities",
                            "The author always states which finding matters most"
                        ],
                        answer: 2,
                        explanation: "Deciding what to emphasize invites subjective judgment that can distort emphasis."
                    },
                    {
                        id: "main-30",
                        part: "Challenges in Abstracting",
                        category: "Quality Control",
                        text: "Why is quality control important in a large abstracting service?",
                        options: [
                            "It allows abstracts to be written without reading the source",
                            "It guarantees that every published document will be abstracted",
                            "It maintains consistent accuracy and style across many abstractors and documents",
                            "It removes the need for editorial review"
                        ],
                        answer: 2,
                        explanation: "Quality control keeps standards consistent when many abstractors contribute."
                    }
                ]
            },
            {
                id: "mod-1",
                title: "Advanced Bibliographic Organization & Metadata Theory",
                description: "Conceptual frameworks of FRBR, RDA, Bibframe, and ontological structuring in digital repositories.",
                questions: [
                    {
                        id: "q1",
                        category: "Metadata Architecture",
                        text: "In the context of FRBR (Functional Requirements for Bibliographic Records), which entity represents the abstract intellectual or artistic creation?",
                        options: ["Work", "Expression", "Manifestation", "Item"],
                        answer: 0,
                        explanation: "A 'Work' is a distinct intellectual or artistic creation. When it is realized, it becomes an 'Expression'."
                    },
                    {
                        id: "q2",
                        category: "Linked Data",
                        text: "BIBFRAME was developed by the Library of Congress primarily to transition bibliographic description from MARC to which web standard?",
                        options: ["Relational SQL Tables", "Linked Data / Semantic Web (RDF/URIs)", "Proprietary XML Schemas", "Flat CSV Records"],
                        answer: 1,
                        explanation: "BIBFRAME leverages Resource Description Framework (RDF) and URIs to make library data part of the global semantic web."
                    },
                    {
                        id: "q3",
                        category: "Taxonomy & Ontology",
                        text: "What is the primary conceptual distinction between a traditional Library Classification scheme and a modern Knowledge Organization System (KOS) Ontology?",
                        options: ["Ontologies define formal semantic relationships (e.g., subclass-of, inverse) beyond hierarchical trees.", "Ontologies are strictly restricted to physical book shelf locations.", "Classification schemes support automated machine reasoning.", "There is no operational or structural difference."],
                        answer: 0,
                        explanation: "Ontologies explicitly model domain concepts and complex semantic relations allowing automated logical inference."
                    },
                    {
                        id: "q4",
                        category: "RDA Standards",
                        text: "Resource Description and Access (RDA) guidelines are fundamentally built upon which guiding conceptual model?",
                        options: ["ISBD (International Standard Bibliographic Description)", "FRBR / LRM (Library Reference Model)", "Dublin Core Simple 15 Elements", "Cutter's Rules for a Printed Dictionary Catalog"],
                        answer: 1,
                        explanation: "RDA was explicitly designed around the FRBR (and later IFLA LRM) user-task and entity-relationship models."
                    },
                    {
                        id: "q5",
                        category: "Subject Access",
                        text: "In faceted classification (S.R. Ranganathan's Colon Classification), what does the acronym PMEST stand for?",
                        options: ["Process, Method, Energy, Space, Time", "Personality, Matter, Energy, Space, Time", "Primary, Material, Equipment, System, Technique", "Publication, Medium, Edition, Series, Title"],
                        answer: 1,
                        explanation: "PMEST represents the five fundamental categories of facet analysis: Personality, Matter, Energy, Space, and Time."
                    }
                ]
            },
            {
                id: "mod-2",
                title: "Information Architecture & Digital Preservation Ecosystems",
                description: "Preservation metadata (PREMIS), OAIS reference model, bit-level integrity, and digital curation policies.",
                questions: [
                    {
                        id: "q6",
                        category: "OAIS Model",
                        text: "In the Open Archival Information System (OAIS) reference model (ISO 14721), what package type is ingested from the producer?",
                        options: ["SIP (Submission Information Package)", "AIP (Archival Information Package)", "DIP (Dissemination Information Package)", "PIP (Preservation Information Package)"],
                        answer: 0,
                        explanation: "Producers submit SIPs, the archive transforms them into AIPs for long-term storage, and serves DIPs to consumers."
                    },
                    {
                        id: "q7",
                        category: "Preservation Metadata",
                        text: "The PREMIS (Preservation Metadata: Implementation Strategies) data dictionary is specifically designed to support what critical function?",
                        options: ["Circulation and patron overdue tracking", "Long-term preservation and viability management of digital objects", "Interlibrary loan courier routing", "Acquisition vendor invoicing"],
                        answer: 1,
                        explanation: "PREMIS defines core preservation metadata for managing digital objects over time, including fixity, rights, and environment."
                    },
                    {
                        id: "q8",
                        category: "Digital Curation",
                        text: "Which of the following describes 'Fixity Checking' in digital preservation repositories?",
                        options: ["Repairing physical book spines and binding", "Generating cryptographic checksums (e.g., MD5, SHA-256) periodically to verify bit rot has not occurred", "Re-cataloging misclassified serial publications", "Upgrading library air conditioning systems"],
                        answer: 1,
                        explanation: "Fixity checking verifies that digital files have not been altered or corrupted over time by comparing current checksums against original values."
                    },
                    {
                        id: "q9",
                        category: "Information Architecture",
                        text: "What is the primary objective of creating a 'Site Map' and 'Taxonomic Navigation Tree' in digital library web information architecture?",
                        options: ["To enhance user findability and reduce cognitive load when navigating complex digital collections", "To increase server bandwidth consumption", "To encrypt patron login passwords", "To comply with physical fire safety regulations"],
                        answer: 0,
                        explanation: "Information architecture focuses on structuring, labeling, and organizing content to support usability and findability."
                    },
                    {
                        id: "q10",
                        category: "Digital Preservation",
                        text: "What is the primary risk associated with 'Technology Obsolescence' in digital libraries?",
                        options: ["Physical dust accumulation on servers", "Inability of modern hardware or software to render or interpret legacy file formats", "Higher electricity bills from older power supplies", "Expired library board trustee terms"],
                        answer: 1,
                        explanation: "When hardware or software required to read legacy file formats becomes obsolete, digital files risk becoming inaccessible unless migrated or emulated."
                    }
                ]
            },
            {
                id: "mod-3",
                title: "Bibliometrics, Scientometrics & Research Evaluation",
                description: "Citation analysis, h-index, Journal Impact Factor (JIF), altmetrics, and information productivity laws.",
                questions: [
                    {
                        id: "q11",
                        category: "Bibliometric Laws",
                        text: "Which bibliometric law describes the frequency distribution of scientific productivity among authors in a given field?",
                        options: ["Zipf's Law", "Bradford's Law of Scattering", "Lotka's Law", "Price's Square Root Law"],
                        answer: 2,
                        explanation: "Lotka's Law models scientific productivity, stating that the number of authors publishing $n$ papers is roughly proportional to $1/n^2$."
                    },
                    {
                        id: "q12",
                        category: "Bradford's Law",
                        text: "Bradford's Law of Scattering is primarily used by information professionals to determine what?",
                        options: ["Core journals in a specific scientific discipline", "Book circulation frequency per academic department", "Patron internet browsing speeds", "Optimal shelf height for rare manuscripts"],
                        answer: 0,
                        explanation: "Bradford's Law helps identify core journals vs. peripheral journals in any subject specialty based on citation and article distribution."
                    },
                    {
                        id: "q13",
                        category: "Citation Metrics",
                        text: "An academic researcher has an h-index of 12. What does this exact metric signify?",
                        options: ["The researcher has published exactly 12 papers in total.", "The researcher has at least 12 papers that have each been cited at least 12 times.", "The researcher's papers have been cited 1200 times overall.", "The researcher's average citation count per year is 12."],
                        answer: 1,
                        explanation: "The h-index measures both productivity and citation impact: $h$ papers published with $\\ge h$ citations each."
                    },
                    {
                        id: "q14",
                        category: "Scientometrics",
                        text: "What is the main limitation of the traditional Journal Impact Factor (JIF) when evaluating individual researcher performance?",
                        options: ["JIF measures journal-level citation averages, which does not reflect the actual citation impact of any single article in that journal.", "JIF is only calculated in physical print format.", "JIF is restricted exclusively to humanities and arts.", "JIF requires no calculation algorithms."],
                        answer: 0,
                        explanation: "JIF evaluates journals, not individual authors or papers; highly skewed citation distributions can inflate a journal's JIF while most articles get few citations."
                    },
                    {
                        id: "q15",
                        category: "Altmetrics",
                        text: "How do Altmetrics differ from traditional bibliometric citation indices (like Web of Science or Scopus)?",
                        options: ["Altmetrics track broader online attention and engagement (social media, policy documents, news, blogs) rather than academic journal citations alone.", "Altmetrics only track physical book borrowing in public libraries.", "Altmetrics are exclusively calculated once every ten years.", "Altmetrics ignore all digital scholarly output."],
                        answer: 0,
                        explanation: "Altmetrics capture real-time broader societal impact and engagement across digital platforms beyond formal peer-reviewed citations."
                    }
                ]
            },
            {
                id: "mod-4",
                title: "Knowledge Management & Semantic Information Systems",
                description: "Tacit vs. explicit knowledge, SECI model, enterprise taxonomies, and knowledge governance.",
                questions: [
                    {
                        id: "q16",
                        category: "Knowledge Conversion",
                        text: "In Nonaka and Takeuchi's SECI model, what knowledge conversion process describes going from 'Tacit to Explicit'?",
                        options: ["Socialization", "Externalization", "Combination", "Internalization"],
                        answer: 1,
                        explanation: "Externalization involves articulating tacit knowledge into explicit concepts (metaphors, analogies, concepts, or models)."
                    },
                    {
                        id: "q17",
                        category: "Enterprise Taxonomies",
                        text: "What is the primary role of a Taxonomy Manager in an enterprise knowledge management environment?",
                        options: ["Fixing broken elevators in the library building", "Designing and governing controlled vocabularies, metadata schemas, and enterprise folksonomies", "Managing faculty payroll and benefits", "Purchasing physical office furniture"],
                        answer: 1,
                        explanation: "Taxonomy managers oversee the controlled vocabularies and tagging structures that ensure enterprise information findability."
                    },
                    {
                        id: "q18",
                        category: "Knowledge Governance",
                        text: "Which of the following best characterizes 'Tacit Knowledge' in organizational knowledge management?",
                        options: ["Knowledge that is easily codified in manuals, databases, and standard operating procedures", "Knowledge embedded in individual experience, intuition, skills, and mental models", "Public domain books stored in national archives", "Patron transaction log files"],
                        answer: 1,
                        explanation: "Tacit knowledge is personal, context-specific, and difficult to formalize or communicate compared to explicit knowledge."
                    },
                    {
                        id: "q19",
                        category: "Semantic Web",
                        text: "What does the SPARQL query language query in semantic web architectures?",
                        options: ["Relational SQL databases", "RDF (Resource Description Framework) triple stores and graph databases", "CSS style sheets", "Raw binary audio files"],
                        answer: 1,
                        explanation: "SPARQL is the standard W3C semantic query language specifically designed to retrieve and manipulate data stored in RDF triple formats."
                    },
                    {
                        id: "q20",
                        category: "Information Audit",
                        text: "An 'Information Audit' within an organization is primarily conducted to achieve what outcome?",
                        options: ["To identify information assets, flows, use patterns, and potential gaps or redundancies across the enterprise", "To audit cafeteria food safety compliance", "To test fire alarm electrical circuits", "To check printer paper inventory"],
                        answer: 0,
                        explanation: "An information audit maps out organizational information resources and usage to optimize information flows and governance."
                    }
                ]
            },
            {
                id: "mod-5",
                title: "Library Law, Professional Ethics & Copyright Jurisprudence",
                description: "RA 9246, intellectual property code (RA 8293), fair use doctrine, and code of ethics for librarians.",
                questions: [
                    {
                        id: "q21",
                        category: "Philippine Library Law",
                        text: "Republic Act No. 9246 is officially known by what legislative title in the Philippines?",
                        options: ["The Philippine Librarianship Act of 2003", "The Intellectual Property Code of the Philippines", "The Public Libraries Act", "The National Archives Act of the Philippines"],
                        answer: 0,
                        explanation: "RA 9246 is 'An Act Regulating the Practice of Librarianship in the Philippines and Prescribing the Qualifications of Librarians'."
                    },
                    {
                        id: "q22",
                        category: "Copyright & Fair Use",
                        text: "Under Philippine Copyright Law (RA 8293), which of the following is considered a valid application of the 'Fair Use' doctrine for libraries?",
                        options: ["Selling unauthorized photocopies of entire textbooks to students for commercial profit", "Making a single copy of a journal article requested by a researcher for private study, research, or education", "Uploading entire bestselling novels to a public file-sharing website", "Translating foreign books without author permission and claiming them as original works"],
                        answer: 1,
                        explanation: "Single copying for private study, research, or educational instruction falls under permitted limitations and exceptions under copyright law."
                    },
                    {
                        id: "q23",
                        category: "Professional Ethics",
                        text: "According to the Code of Ethics for Registered Librarians in the Philippines, what is the librarian's primary professional obligation regarding patron privacy?",
                        options: ["Publicly disclose patron borrowing history during board meetings", "Strictly protect the confidentiality of patron registration and circulation records against unauthorized disclosure", "Sell patron mailing lists to commercial vendors", "Share patron research topics on social media"],
                        answer: 1,
                        explanation: "Librarians must safeguard patron privacy and confidentiality regarding inquiry records and circulation history as a core ethical tenet."
                    },
                    {
                        id: "q24",
                        category: "Intellectual Property",
                        text: "What is the general term of copyright protection for a literary or artistic work under RA 8293 during the lifetime of the author?",
                        options: ["Life of the author plus 50 years after death", "Exactly 10 years from publication", "Life of the author plus 20 years after death", "Indefinite and perpetual protection"],
                        answer: 0,
                        explanation: "Under Philippine copyright law, protection generally lasts during the lifetime of the author plus 50 years after death."
                    },
                    {
                        id: "q25",
                        category: "Professional Regulation",
                        text: "Which government regulatory body in the Philippines administers the Licensure Examination for Librarians (LEL) and issues certificates of registration?",
                        options: ["Department of Education (DepEd)", "Professional Regulation Commission (PRC) through the Board for Librarians", "National Library of the Philippines (NLP)", "Commission on Higher Education (CHED)"],
                        answer: 1,
                        explanation: "The Professional Regulation Commission (PRC) and the Professional Regulatory Board for Librarians oversee licensure and professional practice."
                    }
                ]
            },
            {
                id: "mod-6",
                title: "Collection Development, Acquisitions & Serials Management",
                description: "Selection policies, acquisition methods, approval plans, serials control, and the CREW/MUSTIE weeding framework.",
                questions: [
                    {
                        id: "q26",
                        category: "Collection Development",
                        text: "What is the primary purpose of a written Collection Development Policy in a library?",
                        options: ["To guide the systematic selection, acquisition, and deselection of materials in line with the institution's goals", "To record the daily gate count of library visitors", "To list the home addresses of library staff", "To define the color scheme of the library website"],
                        answer: 0,
                        explanation: "A collection development policy formally documents selection criteria, scope, formats, and weeding guidelines."
                    },
                    {
                        id: "q27",
                        category: "Selection Tools",
                        text: "Which of the following is a standard reviewing journal commonly used by librarians as a selection tool for new books?",
                        options: ["Booklist", "Dewey Decimal Classification", "Anglo-American Cataloguing Rules", "Library of Congress Subject Headings"],
                        answer: 0,
                        explanation: "Booklist is a widely used reviewing periodical that provides critical evaluations to support selection decisions."
                    },
                    {
                        id: "q28",
                        category: "Acquisitions",
                        text: "An arrangement in which a vendor automatically ships newly published titles matching a library's pre-defined profile is called a/an:",
                        options: ["Approval plan (blanket order)", "Firm order", "Standing order", "Interlibrary loan"],
                        answer: 0,
                        explanation: "Approval plans let vendors supply profile-matched materials on approval, which the library may return if unsuitable."
                    },
                    {
                        id: "q29",
                        category: "Serials Management",
                        text: "When an expected issue of a subscribed journal fails to arrive, the serials librarian sends a formal follow-up called a:",
                        options: ["Claim", "Hold", "Recall", "Rider"],
                        answer: 0,
                        explanation: "A claim is a formal request to a vendor or publisher for an issue not received within the expected time."
                    },
                    {
                        id: "q30",
                        category: "Weeding",
                        text: "The CREW method and the MUSTIE criteria are standard tools used for what collection management activity?",
                        options: ["Deselection (weeding) of outdated or damaged library materials", "Original cataloging of rare manuscripts", "Designing library building layouts", "Encoding MARC records"],
                        answer: 0,
                        explanation: "CREW (Continuous Review, Evaluation, and Weeding) and MUSTIE help librarians decide which materials to withdraw."
                    }
                ]
            },
            {
                id: "mod-7",
                title: "Cataloging Practice, Classification Schemes & Authority Control",
                description: "MARC 21 fields, Dewey Decimal and LC Classification, controlled vocabularies, and authority control in practice.",
                questions: [
                    {
                        id: "q31",
                        category: "MARC 21",
                        text: "In the MARC 21 bibliographic format, field 245 corresponds to which element?",
                        options: ["Title and statement of responsibility", "Main entry — personal name", "Physical description", "International Standard Book Number"],
                        answer: 0,
                        explanation: "MARC field 245 records the title proper, other title information, and the statement of responsibility."
                    },
                    {
                        id: "q32",
                        category: "Dewey Decimal Classification",
                        text: "In the Dewey Decimal Classification, class 020 is devoted to which subject?",
                        options: ["Library and information sciences", "Philosophy and psychology", "Religion", "Social sciences"],
                        answer: 0,
                        explanation: "DDC 020 covers Library and Information Sciences, a subdivision of the 000 general works class."
                    },
                    {
                        id: "q33",
                        category: "Library of Congress Classification",
                        text: "In the Library of Congress Classification (LCC), the single-letter class 'Z' is used for which area?",
                        options: ["Bibliography, Library Science, and Information Resources", "Medicine", "Music", "Law"],
                        answer: 0,
                        explanation: "LCC class Z covers bibliography, library science, and information resources — the home of library literature."
                    },
                    {
                        id: "q34",
                        category: "Authority Control",
                        text: "What is the main function of authority control in a library catalog?",
                        options: ["To maintain consistency by using one authorized heading for each name or subject, with cross-references", "To repair the physical bindings of damaged books", "To provide public internet workstations", "To compute the library's annual budget"],
                        answer: 0,
                        explanation: "Authority control ensures that all variants of a name or subject collocate under a single authorized access point."
                    },
                    {
                        id: "q35",
                        category: "Subject Cataloging",
                        text: "Library of Congress Subject Headings (LCSH) is best described as which type of resource?",
                        options: ["A controlled vocabulary of subject headings", "A classification scheme with call numbers", "An encoding standard like MARC", "A metadata element set like Dublin Core"],
                        answer: 0,
                        explanation: "LCSH is a controlled subject-heading vocabulary used to assign consistent topical access points in catalogs."
                    }
                ]
            },
            {
                id: "mod-8",
                title: "Reference Services, User Studies & Information Literacy",
                description: "The reference interview, ready-reference sources, current-awareness services, and user needs assessment.",
                questions: [
                    {
                        id: "q36",
                        category: "Reference Interview",
                        text: "What is the goal of the opening stage of the reference interview?",
                        options: ["To establish rapport and negotiate the user's actual information need", "To immediately charge a service fee", "To close the library for the day", "To assign a call number to the query"],
                        answer: 0,
                        explanation: "The interview opens by welcoming the user and clarifying the real question behind the initial request."
                    },
                    {
                        id: "q37",
                        category: "Reference Sources",
                        text: "Which type of reference source is designed to supply brief, ready-reference facts such as annual statistics, dates, and records?",
                        options: ["Almanac", "Monograph", "Treatise", "Novel"],
                        answer: 0,
                        explanation: "Almanacs and similar ready-reference sources are consulted for quick factual data rather than sustained reading."
                    },
                    {
                        id: "q38",
                        category: "Information Literacy",
                        text: "Which term describes the set of abilities requiring an individual to recognize when information is needed and to locate, evaluate, and use it effectively?",
                        options: ["Information literacy", "Computer maintenance", "Bibliometrics", "Numeracy"],
                        answer: 0,
                        explanation: "Information literacy is the ability to recognize an information need and to find, evaluate, and use information ethically."
                    },
                    {
                        id: "q39",
                        category: "User Studies",
                        text: "The systematic investigation of the information needs and information-seeking behavior of a community is called a:",
                        options: ["User study", "Deselection audit", "Fixity check", "Shell list"],
                        answer: 0,
                        explanation: "User studies examine who uses information, why, and how, to inform the design of better services."
                    },
                    {
                        id: "q40",
                        category: "Current Awareness",
                        text: "Selective Dissemination of Information (SDI) is a current-awareness service that:",
                        options: ["Pushes newly published or newly acquired information to users according to their interest profiles", "Withdraws outdated books from the shelves", "Encodes bibliographic records into MARC", "Repairs torn pages of circulating books"],
                        answer: 0,
                        explanation: "SDI matches incoming information against stored user profiles and delivers items of likely relevance."
                    }
                ]
            },
            {
                id: "mod-9",
                title: "Library Management, Administration & Human Resources",
                description: "Management theories (POSDCORB, Theory X/Y), budgeting methods, organizational structures, and quality management.",
                questions: [
                    {
                        id: "q41",
                        category: "Management Principles",
                        text: "The acronym POSDCORB, used to describe the functions of a library administrator, stands for:",
                        options: ["Planning, Organizing, Staffing, Directing, Coordinating, Reporting, Budgeting", "Purchasing, Ordering, Shelving, Discarding, Cataloging, Organizing, Receiving, Binding", "Planning, Overseeing, Studying, Documenting, Coding, Ranking, Budgeting", "Processing, Organizing, Selecting, Directing, Cataloging, Reporting, Borrowing"],
                        answer: 0,
                        explanation: "Luther Gulick's POSDCORB enumerates the executive functions of management in organizations."
                    },
                    {
                        id: "q42",
                        category: "Budgeting",
                        text: "A budgeting approach that requires every activity and expense to be justified from a zero base each cycle is called:",
                        options: ["Zero-based budgeting", "Line-item budgeting", "Formula budgeting", "Incremental budgeting"],
                        answer: 0,
                        explanation: "Zero-based budgeting starts each cycle from zero, forcing managers to justify all proposed expenditures."
                    },
                    {
                        id: "q43",
                        category: "Human Resources",
                        text: "McGregor's Theory X assumes that employees:",
                        options: ["Dislike work and must be closely supervised and controlled", "Are inherently self-motivated and seek responsibility", "Prefer to set their own budgets", "Do not require any form of management"],
                        answer: 0,
                        explanation: "Theory X holds a pessimistic view of workers, while Theory Y assumes employees are self-directed and seek responsibility."
                    },
                    {
                        id: "q44",
                        category: "Organizational Structure",
                        text: "An organizational structure in which authority flows in a clear vertical chain of command from the director downward is called:",
                        options: ["Line (hierarchical) organization", "Matrix organization", "Flat organization", "Virtual organization"],
                        answer: 0,
                        explanation: "A line organization establishes explicit superior-to-subordinate reporting relationships throughout the institution."
                    },
                    {
                        id: "q45",
                        category: "Quality Management",
                        text: "Which management philosophy emphasizes continuous improvement and patron satisfaction measured against defined service standards?",
                        options: ["Total Quality Management (TQM)", "Scientific Management", "Laissez-faire management", "Autocratic management"],
                        answer: 0,
                        explanation: "TQM focuses on ongoing improvement, teamwork, and meeting or exceeding customer (patron) expectations."
                    }
                ]
            },
            {
                id: "mod-10",
                title: "Library Automation, Information Technology & Digital Repositories",
                description: "Integrated library systems, metadata interoperability (Z39.50, OAI-PMH), Dublin Core, and persistent identifiers.",
                questions: [
                    {
                        id: "q46",
                        category: "Library Automation",
                        text: "An Integrated Library System (ILS) typically bundles which core functional modules?",
                        options: ["Cataloging, circulation, acquisitions, serials, and the OPAC", "Only the public website and blog", "Word processing and spreadsheet tools", "Photocopying and binding equipment"],
                        answer: 0,
                        explanation: "An ILS integrates the major library workflows — cataloging, circulation, acquisitions, serials, and the public catalog."
                    },
                    {
                        id: "q47",
                        category: "Metadata Standards",
                        text: "Dublin Core is best described as:",
                        options: ["A simple, interoperable 15-element metadata set for describing digital resources", "A proprietary programming language", "A hierarchical classification scheme like DDC", "An interlibrary loan courier protocol"],
                        answer: 0,
                        explanation: "Dublin Core provides a basic, cross-domain element set (title, creator, subject, etc.) for resource discovery."
                    },
                    {
                        id: "q48",
                        category: "Interoperability",
                        text: "The Z39.50 and SRU protocols are used primarily to:",
                        options: ["Search and retrieve records from remote library catalogs across different systems", "Encrypt patron passwords on the server", "Print spine labels for new books", "Measure citation impact factors"],
                        answer: 0,
                        explanation: "Z39.50/SRU enable client-server information retrieval, allowing one catalog to query another regardless of vendor."
                    },
                    {
                        id: "q49",
                        category: "Digital Repositories",
                        text: "The Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) is used to:",
                        options: ["Expose and harvest metadata records between repositories and aggregators", "Scan printed books into image files", "Calculate journal impact factors", "Assign Dewey numbers automatically"],
                        answer: 0,
                        explanation: "OAI-PMH lets data providers expose metadata that service providers harvest and aggregate for discovery."
                    },
                    {
                        id: "q50",
                        category: "Persistent Identifiers",
                        text: "A Digital Object Identifier (DOI) is used in digital libraries primarily to:",
                        options: ["Provide a persistent, citable identifier for a digital object", "Store the full text of an article on a local disk", "Replace the need for any metadata", "Track the physical location of a printed book"],
                        answer: 0,
                        explanation: "A DOI permanently identifies a digital object and resolves to its current location, supporting stable citation."
                    }
                ]
            }
        ];

// ---------------------------------------------------------------------------
// Trial-module unlocking
// Which part of the Main Module ("Comprehensive Abstracting") unlocks each
// Abstract Examination Trial Module. A part below the mastery threshold
// (see UNLOCK_THRESHOLD in exam-app.js) reveals its related trial modules.
// ---------------------------------------------------------------------------
const TRIAL_MODULE_TOPICS = {
    "mod-1":  ["Abstracting Knowledge"],
    "mod-4":  ["Abstracting Knowledge"],
    "mod-7":  ["Abstracting Knowledge"],
    "mod-6":  ["Abstracting Skills"],
    "mod-8":  ["Abstracting Skills"],
    "mod-9":  ["Abstracting Skills"],
    "mod-2":  ["Challenges in Abstracting"],
    "mod-3":  ["Challenges in Abstracting"],
    "mod-5":  ["Challenges in Abstracting"],
    "mod-10": ["Challenges in Abstracting"]
};

// ---------------------------------------------------------------------------
// The three parts of the Main Module, described on the home page so the
// assessment reads as the main event of the site.
// ---------------------------------------------------------------------------
const MAIN_PART_BLURBS = {
    "Abstracting Knowledge":
        "The conceptual groundwork &mdash; what an abstract is, the types that exist, and the standards and purposes that guide their creation.",
    "Abstracting Skills":
        "The practical craft &mdash; condensing a source into a faithful, objective summary while keeping its essential content intact.",
    "Challenges in Abstracting":
        "The difficult cases &mdash; accuracy versus brevity, bias, ethics, copyright, and consistency across a whole collection."
};

// ---------------------------------------------------------------------------
// Recommended learning materials: the same resources the Review Library
// (library.html) curates, reused beside a result so a weak attempt points
// straight at study material.
// ---------------------------------------------------------------------------
const LEARNING_MATERIALS = [
    {
        tag: "Practice",
        title: "PRC Board Reviewers PH Practice Sets",
        url: "https://prcboardreviewersph.com/lle-reviewers"
    },
    {
        tag: "Portal",
        title: "National Library of the Philippines Learning Portal",
        url: "https://learningportal.nlp.gov.ph/"
    },
    {
        tag: "Download",
        title: "BSU 2021 Free LLE Reviewer Package",
        url: "https://tiny.one/2zawvbcb"
    },
    {
        tag: "Download",
        title: "BSU 2022 Free LLE Reviewer Extension",
        url: "https://bit.ly/3m6i2RL"
    },
    {
        tag: "Printable",
        title: "Printable Answer Tracking Sheets",
        url: "https://bit.ly/3JGBaAH"
    },
    {
        tag: "PDF",
        title: "Library and Information Science Reviewer (12 Units)",
        url: "https://www.scribd.com/document/317123232/Library-and-Information-Science-Reviewer"
    },
    {
        tag: "PDF",
        title: "LLE Reviewer for Librarians Exam (235 Pages)",
        url: "https://www.scribd.com/document/662156936/LLE-Reviewer-2022-1"
    },
    {
        tag: "Mock Test",
        title: "Pre-Board Exam for Organization, Management, and Laws",
        url: "https://www.scribd.com/document/707099476/Pre-Board-Exam-for-Org-Management-and-Laws-With-Key-Answers-docx"
    },
    {
        tag: "Study Guide",
        title: "LLE Board Exam Syllabus Review Notes Outline",
        url: "https://www.docsity.com/en/docs/review-notes-for-the-lle-board-exam/2186974/"
    }
];

// ---------------------------------------------------------------------------
// Video lectures: real, embeddable YouTube videos that play inside the site
// (see playLecture in exam-app.js) so nobody is sent off to YouTube.
// `tags` are matched against the topics of an attempt; the lectures covering
// the weakest topics are floated to the top of the recommendations.
// ---------------------------------------------------------------------------
const LEARNING_VIDEOS = [
    {
        id: "XMe1QSxh9hk",
        title: "Indexes and Abstracts: The Basics for Filipino Librarians and LIS Students",
        channel: "Malditang Librarian",
        tags: ["abstract", "index", "condens", "summar", "editing", "citation", "bibliometr", "scientometr", "accuracy", "objectiv", "coverage"]
    },
    {
        id: "cF232UMmErw",
        title: "Review and Preparation for the LLE",
        channel: "BLISS Organization",
        tags: ["review", "licensur", "professional", "management", "organization", "collection", "acquisit", "budget", "human resources", "law", "reference", "literacy", "weeding", "serials", "audit"]
    },
    {
        id: "puGnMbBcSfs",
        title: "Reviewers and Books I Used to Pass the Librarians Licensure Exam",
        channel: "Malditang Librarian",
        tags: ["review", "reference", "collection", "licensur", "selection", "current awareness"]
    },
    {
        id: "1Y7HJjkNyrQ",
        title: "Dewey Decimal Classification System: How Books Are Arranged in the Library",
        channel: "RGULibrary",
        tags: ["classif", "catalog", "dewey", "marc", "metadata", "authority", "subject", "taxonom", "linked", "interoperab", "ontolog", "preserv"]
    },
    {
        id: "RNEDEk1Tz4Y",
        title: "How to Understand the Dewey Decimal System",
        channel: "Howcast",
        tags: ["classif", "dewey", "catalog", "subject", "shelf"]
    },
    {
        id: "WQUTb4Hc9NM",
        title: "Self Review Tips for the Board Exam: How to Start Self Reviewing",
        channel: "Malditang Librarian",
        tags: ["review", "study", "research", "evaluation", "assessment", "reading"]
    },
    {
        id: "fAPpBYLrJAc",
        title: "Top 10 Tips on Passing the Board Exam from a Topnotcher",
        channel: "Malditang Librarian",
        tags: ["review", "tips", "licensur", "exam", "time management"]
    }
];
