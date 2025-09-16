import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Apply() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        console.error("Error fetching service:", err);
      }
    };
    fetchService();
  }, [serviceId]);

  if (!service) return <p>Loading...</p>;

  return (
    <div>
      <h2>Apply for {service.title}</h2>
      <p>{service.description}</p>
      <h4>Required Documents:</h4>
      <ul>
        {service.requiredDocuments.map((doc, i) => (
          <li key={i}>{doc}</li>
        ))}
      </ul>
    </div>
  );
}

export default Apply;
