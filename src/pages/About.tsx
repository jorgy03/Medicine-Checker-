function About() {
  return (
    <section className="flex w-full flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        About
      </h1>
      <p className="text-slate-600">
        Pill Checker lets you search a medication by name and see its
        canonical identity: brand and generic names, available strengths and
        dosage forms, National Drug Codes (NDCs), and reference codes (ATC,
        SNOMED CT, DrugBank), plus a link to the full FDA label on DailyMed.
      </p>
      <p className="text-slate-600">
        Data comes from the{' '}
        <a
          href="https://rxnav.nlm.nih.gov/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-slate-900"
        >
          RxNorm API
        </a>
        , a free public service from the U.S. National Library of Medicine.
      </p>
      <p className="text-slate-600">
        <strong>Limitation:</strong> identifying a pill visually by its
        imprint, color, or shape is not supported — NLM's RxImage service
        that previously provided this was discontinued and is no longer
        reachable. This app can confirm what a medication <em>name</em> is,
        not identify an unlabeled pill by appearance.
      </p>
    </section>
  )
}

export default About
