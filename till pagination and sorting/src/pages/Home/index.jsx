import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { getAllBooks } from "../../service/book.service";
import {
  BookCard,
  BookImage,
  BookName,
  BookSub,
  GridContainer,
} from "../../style";
import ReactPaginate from "react-paginate";
import "./pagination.css";

const BookGrid = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllBooks();
        setBooks(response);
        setLoading(false);
      } catch (error) {
        console.error("Error getting books:", error);
      }
    };

    if (books.length === 0) {
      fetchData();
    }
  }, [books]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortBooks = (books) => {
    if (sortBy === "name") {
      return [...books].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
      return [...books].sort((a, b) => a.price - b.price);
    } else {
      return books;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  const sortedBooks = sortBooks(books);
  const paginatedBooks = sortedBooks.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <GridContainer>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="sortBy">Sort By:</label>
        <select id="sortBy" value={sortBy} onChange={handleSortByChange}>
          <option value="">None</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>
      <Grid container spacing={2} className="book-grid">
        {paginatedBooks.map((book) => (
          <Grid item xs={4} sm={3} md={2} key={book.id} marginBottom="2vh">
            <BookCard elevation={3}>
              <BookImage
                src={book.base64image}
                alt={book.name}
                className="book-image"
              />
              <BookName variant="h6" style={{ fontSize: "1rem" }}>
                {book.name}
              </BookName>
              <BookSub variant="subtitle1">
                {book.description.slice(0, 30)}
              </BookSub>
              <BookSub variant="subtitle1">Rs. {book.price}</BookSub>
              <Button variant="contained" color="primary">
                Add to Cart
              </Button>
            </BookCard>
          </Grid>
        ))}
      </Grid>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={Math.ceil(sortedBooks.length / itemsPerPage)}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
        previousLinkClassName={"previous-link"}
        nextLinkClassName={"next-link"}
        disabledClassName={"disabled"}
        breakClassName={"break"}
      />
    </GridContainer>
  );
};

export default BookGrid;
