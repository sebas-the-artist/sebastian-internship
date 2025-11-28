import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import AOS from "aos";
import "aos/dist/aos.css";

const skeletonStyles = `
  .skeleton-card {
    background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 37%,#f0f0f0 64%);
    background-size: 400% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 12px;
    height: 300px;
    margin: 8px;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonCard = () => (
  <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
    <div className="skeleton-card"></div>
  </div>
);

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

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
      .catch(() => setLoading(false));
    AOS.init({ duration: 1001, once: false });

    const handleLoad = () => {
      AOS.refresh();
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const responsive = {
    0: { items: 1 },
    600: { items: 2 },
    900: { items: 3 },
    1200: { items: 4 },
  };

  return (
    <>
      <style>{skeletonStyles}</style>
      <section id="section-collections" className="no-bottom">
        <div className="container carousel-container">
          <div className="row" data-aos="fade-up" data-aos-delay="300">
            <div className="col-lg-12 text-center">
              <h2 data-aos="fade-down" data-aos-delay="200">
                Hot Collections
              </h2>
              <div
                className="small-border bg-color-2"
                data-aos="fade-right"
                data-aos-delay="800"
              ></div>
            </div>
          </div>
          {loading ? (
            <div className="row">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <OwlCarousel
              className="owl-theme"
              data-aos="fade-up"
              data-aos-delay="100"
              loop
              margin={16}
              nav
              navText={[
                '<i class="fa fa-chevron-left"></i>',
                '<i class="fa fa-chevron-right"></i>',
              ]}
              responsive={responsive}
              smartSpeed={500}
            >
              {collections.map((col, i) => (
                <div
                  className="nft_coll"
                  key={col.id || i}
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="nft_wrap">
                    <Link to={`/item-details/${col.nftId}`}>
                      <img
                        src={col.nftImage}
                        className="lazy img-fluid"
                        alt={col.title}
                      />
                    </Link>
                  </div>
                  <div className="nft_coll_pp">
                    <Link to={`/author/${col.authorId}`}>
                      <img
                        className="lazy pp-coll"
                        src={col.authorImage}
                        alt={col.authorName}
                      />
                    </Link>
                    <i className="fa fa-check"></i>
                  </div>
                  <div className="nft_coll_info">
                    <Link to={`/explore/${col.nftId}`}>
                      <h4>{col.title}</h4>
                    </Link>
                    <span>ERC-{col.code}</span>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          )}
        </div>
      </section>
    </>
  );
};

export default HotCollections;
