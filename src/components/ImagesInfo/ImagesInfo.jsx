import { Component } from "react";
import Loader from "react-loader-spinner";
import imagesAPI from "../services/imagesApi";
import ImageGallery from "../ImageGallery/ImageGallery";
import Button from "../Button/Button";

export default class ImagesInfo extends Component {
  state = {
    images: [],
    error: null,
    status: "idle",
    page: 1,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.imageName;
    const nextName = this.props.imageName;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevName !== nextName) {
      this.setState({ images: [] });
      this.fetchImagesOnClick(nextName, nextPage);
    }

    if (prevPage !== nextPage && nextPage !== 1) {
      this.setState({ status: "pending" });
      this.fetchImagesOnClick(nextName, nextPage);
    }
  }

  fetchImagesOnClick = (nextName, nextPage) => {
    this.setState({ status: "pending" });

    imagesAPI
      .fetchImages(nextName, nextPage)
      .then((newImages) => {
        if (newImages.total !== 0) {
          this.setState(({ images }) => ({
            images: [...images, ...newImages.hits],
            status: "resolved",
          }));
          nextPage > 1 &&
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });
          return;
        }
        return Promise.reject(new Error("Invalid request"));
      })
      .catch((error) => this.setState({ error, status: "rejected" }));
  };

  onClickLoadMore = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { error, status } = this.state;

    if (status === "idle") {
      return <p>Enter something to see the pictures</p>;
    }

    if (status === "pending") {
      return (
        <Loader
          type='Grid'
          color='darkgrey'
          height={50}
          width={50}
          timeout={5000}
        />
      );
    }

    if (status === "rejected") {
      return (
        <div role='alert'>
          <p>Sorry, something went wrong. Error: {error.message}</p>
        </div>
      );
    }

    if (status === "resolved") {
      return (
        <>
          <ImageGallery images={this.state.images} />
          <Button onClick={this.onClickLoadMore} page={this.state.page} />
        </>
      );
    }
  }
}