const express = require("express");
const movies = require("./movies");
const connection = require("./config");

const port = 3000 ;
const app = express();

function logInfos(req, res, next) {
  console.log(`${req.method} request on ${req.url} from ${req.hostname}`);
  next();
}

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    console.error(err);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.use(logInfos);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my favorite movie list");
});

//----------------------MOVIES----------------------------//

//----GET----// All-View

app.get("/api/movies", (req, res) => {
  connection.query("SELECT * from movies", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

//----GET----// View-movie-by-id

app.get("/api/movies/:id", (req, res) => {
  connection.query(
    "SELECT * from movies WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {  
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//----GET----// View-movie-filter-by-maxDuration

app.get("/api/search", (req, res) => {
  connection.query(
    'select * from movies where duration>=?',
    [req.query.durationMax],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//----POST----// Add-a-movie

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies(title, director, year, color, duration) VALUES(?, ?, ?, ?, ?)",
    [title, director, year, color, duration], 
    (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error saving a movie");
          } else {
            res.status(200).send("Successfully saved");
          }
        }
    ); 
});

//----PUT----// Update-a-movie-by-id

app.put("/api/movies/:id", (req, res) => {
  const idMovie = req.params.id;
  const newMovie = req.body;

  connection.query(
    "UPDATE movies SET ? WHERE id = ?",
    [newMovie, idMovie],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a movie");
      } else {
        res.status(200).send("User updated successfully 🎉");
      }
    }
  );
});

//----DELETE----// Delete-a-movie-by-id


app.delete("/api/movies/:id", (req, res) => {
  const idMovie = req.params.id;

  connection.query(
    "DELETE FROM movies WHERE id = ?",
    [idMovie],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting a movie");
      } else {
        res.status(200).send("🎉 Movie deleted!");

      }
    }
  );
});

//----------------------USERS----------------------------//

//----GET----// All-View

app.get("/api/users", (req, res) => {
  connection.query("SELECT * from users", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

//----POST----// Add-a-user

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  connection.query(
    "INSERT INTO users(firstname, lastname, email) VALUES(?, ?, ?)",
    [firstname, lastname, email], 
    (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error saving a user");
          } else {
            res.status(200).send("Successfully saved");
          }
        }
    ); 
});

//----PUT----// Update-a-user-by-id

app.put("/api/users/:id", (req, res) => {
  const idUser = req.params.id;
  const newUser = req.body;

  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [newUser, idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a user");
      } else {
        res.status(200).send("User updated successfully 🎉");
      }
    }
  );
});

//----DELETE----// Delete-a-user-by-id


app.delete("/api/users/:id", (req, res) => {
  const idUser = req.params.id;

  connection.query(
    "DELETE FROM users WHERE id = ?",
    [idUser],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting an user");
      } else {
        res.status(200).send("🎉 User deleted!");

      }
    }
  );
});


app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});