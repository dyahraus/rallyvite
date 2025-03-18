export default function RallySummaryForm({ getTogether }) {
  return (
    <div>
      <p>Your Get-Together Details</p>
      <h2>{getTogether.name}</h2>
      <h2>{getTogether.description}</h2>
      {getTogether.duration.trim() ? (
        <p>Let's get together for ~{getTogether.duration} @</p>
      ) : null}
    </div>
  );
}
