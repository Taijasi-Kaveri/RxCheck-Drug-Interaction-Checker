import { useState } from "react";

function App() {
  const [drugOne, setDrugOne] = useState("");
  const [drugTwo, setDrugTwo] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkInteraction = async () => {
    if (!drugOne || !drugTwo) {
      setError("Please enter both drug names.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/DrugInteraction/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugOne, drugTwo }),
      });

      if (!response.ok) throw new Error("Something went wrong.");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to fetch interaction. Make sure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💊 RxCheck</h1>
      <p style={styles.subtitle}>AI-powered drug interaction checker</p>

      <div style={styles.card}>
        <input
          style={styles.input}
          type="text"
          placeholder="Drug 1 (e.g. Aspirin)"
          value={drugOne}
          onChange={(e) => setDrugOne(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Drug 2 (e.g. Warfarin)"
          value={drugTwo}
          onChange={(e) => setDrugTwo(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={checkInteraction}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Interaction"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>

      {result && (
        <div style={styles.resultCard}>
          <div style={{
            ...styles.severityBadge,
            background: result.severity === "High" || result.severity === "Critical" ? "#ff4d4d" :
                        result.severity === "Moderate" ? "#ff9900" : "#28a745"
          }}>
            {result.severity} Risk
          </div>
          <p style={styles.summary}>{result.summary}</p>
          <h3 style={styles.sectionTitle}>Symptoms to watch for:</h3>
          <ul style={styles.list}>
            {result.symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
          <h3 style={styles.sectionTitle}>Recommendation:</h3>
          <p style={styles.recommendation}>{result.recommendation}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" },
  title: { textAlign: "center", color: "#2E4057", fontSize: "2rem" },
  subtitle: { textAlign: "center", color: "#666", marginBottom: "2rem" },
  card: { background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" },
  input: { width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1rem", boxSizing: "border-box" },
  button: { width: "100%", padding: "0.75rem", background: "#2E4057", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" },
  error: { color: "red", marginTop: "0.5rem" },
  resultCard: { background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "1.5rem" },
  severityBadge: { display: "inline-block", color: "white", padding: "0.3rem 1rem", borderRadius: "20px", fontWeight: "bold", marginBottom: "1rem" },
  summary: { color: "#333", lineHeight: "1.6" },
  sectionTitle: { color: "#2E4057", marginTop: "1rem" },
  list: { color: "#333", lineHeight: "2" },
  recommendation: { color: "#333", lineHeight: "1.6", fontStyle: "italic" }
};

export default App;

