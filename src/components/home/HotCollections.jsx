import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

const skeletonStyles = `
  .skeleton-card {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 37%,
      #f0f0f0 64%
    );
    background-size: 400% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 12px;
    height: 300px;
    margin: 8px;
  }
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonCard = () => <div className="skeleton-card" />;

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keen Slider init
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 4, spacing: 16 },
    breakpoints: {
      "(max-width: 1200px)": { slides: { perView: 3 } },
      "(max-width: 900px)": { slides: { perView: 2 } },
      "(max-width: 600px)": { slides: { perView: 1 } },
    },
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
      )
      .then((res) => {
        setCollections(res.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch hot collections:", error);
        setLoading(false);
      });
  }, []);

  const buttonBaseStyle = {
    position: "absolute",
    top: "50%",
    zIndex: 10,
    background: "rgba(34,34,34,0.7)",
    borderRadius: "50%",
    border: "none",
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "transform 0.3s ease, background-color 0.4s ease",
  };

  const [prevHover, setPrevHover] = useState(false);
  const [nextHover, setNextHover] = useState(false);

  return (
    <>
      <style>{skeletonStyles}</style>
      <section id="section-collections" className="no-bottom">
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>

            <button
              style={{
                ...buttonBaseStyle,
                left: 0,
                transform: prevHover ? "scale(1.3)" : "scale(1)",
                backgroundColor: prevHover ? "grey" : "rgba(34,34,34,0.7)",
              }}
              aria-label="Previous"
              onClick={() => instanceRef.current?.prev()}
              onMouseEnter={() => setPrevHover(true)}
              onMouseLeave={() => setPrevHover(false)}
            >
              <i
                className="fa fa-chevron-left"
                style={{ color: "#fff", fontSize: 22 }}
              />
            </button>

            <button
              style={{
                ...buttonBaseStyle,
                right: 0,
                transform: nextHover ? "scale(1.3)" : "scale(1)",
                backgroundColor: nextHover ? "grey" : "rgba(34,34,34,0.7)",
              }}
              aria-label="Next"
              onClick={() => instanceRef.current?.next()}
              onMouseEnter={() => setNextHover(true)}
              onMouseLeave={() => setNextHover(false)}
            >
              <i
                className="fa fa-chevron-right"
                style={{ color: "#fff", fontSize: 22 }}
              />
            </button>

            {loading ? (
              <div className="keen-slider col-12" style={{ display: "flex" }}>
                {[...Array(4)].map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            ) : (
              <div ref={sliderRef} className="keen-slider col-12">
                {collections.map((item) => (
                  <div className="keen-slider__slide" key={item.id}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            loading="lazy"
                            src={item.nftImage}
                            className="lazy img-fluid"
                            alt={item.title}
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to={`/author/${item.authorId}`}>
                          <img
                            loading="lazy"
                            className="lazy pp-coll"
                            src={item.authorImage}
                            alt={item.title}
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{item.title}</h4>
                        </Link>
                        <span>ERC-{item.code}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HotCollections;
