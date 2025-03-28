export default function FaqAccordion({ title, text }) {
  return (
    <div className="collapse collapse-plus bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-3" defaultChecked />
        <div className="collapse-title font-semibold">{title}</div>
        <div className="collapse-content text-sm">{text}</div>
    </div>
  )
}
