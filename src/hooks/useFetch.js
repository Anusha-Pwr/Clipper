import React, { useState } from "react";

const useFetch = (cb, options={}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fn(...args) {
    try {
      setError(null);
      setLoading(true);
      const response = await cb(options, ...args);
      setData(response);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fn };
};

export default useFetch;
