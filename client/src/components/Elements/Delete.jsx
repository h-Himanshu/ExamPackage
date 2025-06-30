import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Delete(props) {
  const { type, id } = useParams();
  const [deleted, setDeleted] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const confirmData = window.confirm(
      `Are you sure you want to delete ${type} with id ${id}?`
    );

    if (confirmData) {
      const controller = new AbortController();
      const signal = controller.signal;

      fetch(`/API/query/${type}/${id}`, {
        method: "delete",
        signal,
      })
        .then((res) => {
          if (res.ok) {
            setDeleted(true);
          }
          setFetched(true);
        })
        .catch((err) => {
          console.error("Error deleting:", err);
          setFetched(true); // Ensure fetched is set to true even on error
        });

      return () => {
        controller.abort(); // Cleanup function to abort fetch if component unmounts
      };
    }
  }, [type, id]);

  return (
    <div>
      {fetched && (
        <p>
          {deleted ? (
            <p>Your {type} has been deleted.</p>
          ) : (
            <p>
              Cannot delete your {type},{deleted ? "fetched" : "not fetched"}{" "}
              because it has associated data.
            </p>
          )}
        </p>
      )}
      <p>
        <a href="#" onClick={() => window.history.back()}>
          Go back
        </a>
      </p>
    </div>
  );
}
