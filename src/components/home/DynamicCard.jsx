import React from "react";

const DynamicCard = ({ cardData, loading, children }) => {
  if (loading) {
    return <div className="skeleton-card" />;
  }

  if (!cardData) {
    return null;
  }

  return (
    <div className="card">
      <img
        src={cardData.nftImage || ""}
        alt={cardData.title || "NFT"}
        className="card-img-top"
        loading="lazy"
        style={{
          width: "100%",
          maxHeight: "220px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{cardData.title}</h5>
        {children}
      </div>
    </div>
  );
};

export default DynamicCard;

/* import React from "react";

const DynamicCard = ({ cardData, loading, children }) => {
  if (loading) {
    return <div className="skeleton-card" />;
  }

  return (
    <div className="card">
      <img
        src={cardData?.image || ""}
        className="card-img-top"
        alt={cardData?.title || "NFT"}
        loading="lazy"
      />
      <div className="card-body">
        <h5 className="card-title">{cardData?.title}</h5>
        <p className="card-text">{cardData?.description || "No description"}</p>
        {children}
      </div>
    </div>
  );
};

export default DynamicCard;
 */
