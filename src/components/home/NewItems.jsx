import React, { useEffect, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

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
    height: 320px;
    margin: 8px;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0 }
    100% { background-position: -200% 0 }
  }
  .carousel-container {
    position: relative;
  }
  .owl-nav button {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    background: rgba(34,34,34,0.7);
    border-radius: 50%;
    border: none;
    width: 40px;
    height: 40px;
    color: white;
    font-size: 22px;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.4s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .owl-nav button:hover {
    transform: translateY(-50%) scale(1.3);
    background-color: grey;
  }
  .owl-nav .owl-prev {
    left: 10px;
    border: none;
  }
  .owl-nav .owl-next {
    right: 10px;
    border: none;
  }
  .fa-chevron-left, .fa-chevron-right {
    color: white;
  }
  .fa-chevron-left {
    padding-right: 4px;
  }
  .fa-chevron-right {
    padding-left: 4px;
  }
`;

const SkeletonCard = () => <div className="skeleton-card" />;

const CountdownTimer = memo(({ expiryDate }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = (expiryDate, currentDate) => {
    const diff = new Date(expiryDate) - new Date(currentDate);
    if (!expiryDate) return null;
    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ];
  };

  const countdown = getCountdown(expiryDate, now);
  if (!countdown) return null;

  return countdown === "Expired" ? (
    <div className="de_countdown">Expired</div>
  ) : (
    <div className="de_countdown">
      {countdown[0]}h {countdown[1]}m {countdown[2]}s
    </div>
  );
});

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.slice(0, 7));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const responsiveSettings = {
    0: { items: 1 },
    600: { items: 2 },
    900: { items: 2 },
    980: { items: 3 },
    1200: { items: 4 },
  };

  return (
    <>
      <style>{skeletonStyles}</style>
      <section id="section-items" className="no-bottom">
        <div className="container carousel-container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>

            {loading ? (
              <>
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                  >
                    <SkeletonCard />
                  </div>
                ))}
              </>
            ) : (
              <OwlCarousel
                className="owl-theme col-12"
                loop
                margin={16}
                nav
                navText={[
                  '<i class="fa fa-chevron-left"></i>',
                  '<i class="fa fa-chevron-right"></i>',
                ]}
                responsive={responsiveSettings}
                smartSpeed={500}
                slideBy={1}
                lazyLoad
              >
                {items.map((item) => (
                  <div key={item.id} className="nft__item">
                    <div className="author_list_pp">
                      <Link
                        to={`/author/${item.authorId}`}
                        title={`Creator: ${item.authorId}`}
                      >
                        <img
                          className="lazy"
                          src={item.authorImage}
                          alt={`${item.authorId} avatar`}
                        />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>

                    <CountdownTimer expiryDate={item.expiryDate} />

                    <div className="nft__item_wrap">
                      <Link to={`/item-details/${item.id}`}>
                        <img
                          src={item.nftImage}
                          className="lazy nft__item_preview"
                          alt={item.title}
                          loading="lazy"
                        />
                      </Link>
                    </div>

                    <div className="nft__item_info">
                      <Link to={`/item-details/${item.id}`}>
                        <h4>{item.title}</h4>
                      </Link>
                      <div className="nft__item_price">{item.price} ETH</div>
                      <div
                        className="nft__item_like"
                        onClick={() => navigate(`/item-details/${item.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </OwlCarousel>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default NewItems;

/*
import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const NewItems = () => {
  return (
    <section id="section-items" className="no-bottom">
    <div className="container">
        <div className="row">
        <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
              </div>
              </div>
              {new Array(4).fill(0).map((_, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to="/author"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Creator: Monica Lucas"
                    >
                    <img className="lazy" src={AuthorImage} alt="" />
                    <i className="fa fa-check"></i>
                    </Link>
                    </div>
                    <div className="de_countdown">5h 30m 32s</div>
                    
                    <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                    <button>Buy Now</button>
                    <div className="nft__item_share">
                    <h4>Share</h4>
                    <a href="" target="_blank" rel="noreferrer">
                    <i className="fa fa-facebook fa-lg"></i>
                    </a>
                        <a href="" target="_blank" rel="noreferrer">
                        <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                        <i className="fa fa-envelope fa-lg"></i>
                        </a>
                        </div>
                        </div>
                        </div>
                        
                  <Link to="/item-details">
                  <img
                      src={nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                      />
                      </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                  <h4>Pinky Ocean</h4>
                  </Link>
                  <div className="nft__item_price">3.08 ETH</div>
                  <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>69</span>
                  </div>
                  </div>
                  </div>
                  </div>
                ))}
                </div>
                </div>
                </section>
              );
            };
            
            export default NewItems;
            */

/* import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

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
    height: 320px;
    margin: 8px;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0 }
    100% { background-position: -200% 0 }
  }
  .carousel-container {
    position: relative;
  }
  .owl-nav button {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    background: rgba(34,34,34,0.7);
    border-radius: 50%;
    border: none;
    width: 40px;
    height: 40px;
    color: white;
    font-size: 22px;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.4s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .owl-nav button:hover {
    transform: translateY(-50%) scale(1.3);
    background-color: grey;
  }
  .owl-nav .owl-prev {
    left: 10px;
    border: none;
  }
  .owl-nav .owl-next {
    right: 10px;
    border: none;
  }
    .fa-chevron-left, .fa-chevron-right {
    color: white;
  }
  .fa-chevron-left {
    padding-right: 4px;
  }
  .fa-chevron-right {
    padding-left: 4px;
  }
`;

const SkeletonCard = () => <div className="skeleton-card" />;

const getCountdown = (expiryDate, currentDate) => {
  const diff = new Date(expiryDate) - new Date(currentDate);
  if (!expiryDate) return null; // Validation for expiryDate
  if (diff <= 0) return "Expired"; // Return "Expired" if the countdown is done
  console.log(diff);

  // Convert milliseconds to hours, minutes, and seconds
  const hours = Math.floor(diff / (1000 * 60 * 60)); // Total hours
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
  const seconds = Math.floor((diff % (1000 * 60)) / 1000); // Remaining seconds

  // Format the output to ensure two-digit representation
  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ];
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.slice(0, 7)); // get up to 7 items
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  console.log(items); // For debugging
  // Owl Carousel breakpoints with max 4 items to show
  const responsiveSettings = {
    0: { items: 1 },
    600: { items: 2 },
    900: { items: 3 },
    1200: { items: 4 },
  };

  return (
    <>
      <style>{skeletonStyles}</style>
      <section id="section-items" className="no-bottom">
        <div className="container carousel-container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>

            {loading ? (
              <>
                {[...Array(4)].map((_, idx) => (
                  <div
                    key={idx}
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                  >
                    <SkeletonCard />
                  </div>
                ))}
              </>
            ) : (
              <OwlCarousel
                className="owl-theme col-12"
                loop
                margin={16}
                nav
                navText={[
                  '<i class="fa fa-chevron-left"></i>',
                  '<i class="fa fa-chevron-right"></i>',
                ]}
                responsive={responsiveSettings}
                smartSpeed={500}
                slideBy={1}
                lazyLoad
              >
                {items.map((item) => {
                  const countdown = getCountdown(item.expiryDate, Date.now());
                  return (
                    <div key={item.id} className="nft__item">
                      <div className="author_list_pp">
                        <Link
                          to={`/author/${item.authorId}`}
                          title={`Creator: ${item.authorId}`}
                        >
                          <img
                            className="lazy"
                            src={item.authorImage}
                            alt={`${item.authorId} avatar`}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      {countdown && (
                        <div className="de_countdown">
                          {countdown[0]}h {countdown[1]}m {countdown[2]}s
                        </div>
                      )}
                      <div className="nft__item_wrap">
                        <Link to={`/item-details/${item.id}`}>
                          <img
                            src={item.nftImage}
                            className="lazy nft__item_preview"
                            alt={item.title}
                            loading="lazy"
                          />
                        </Link>
                      </div>
                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.id}`}>
                          <h4>{item.title}</h4>
                        </Link>
                        <div className="nft__item_price">{item.price} ETH</div>
                        <div
                          className="nft__item_like"
                          onClick={() => navigate(`/item-details/${item.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa fa-heart"></i>
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </OwlCarousel>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default NewItems; */
