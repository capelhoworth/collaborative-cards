import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import token from "../token.json";
import placeholder from "../no-cover-image.png";
import he from "he";
import { Navigate, useNavigate, Link, Route, Routes, useParams } from "react-router-dom";

function EditCard({ loginToken }) {
  const {cardID} = useParams();
  console.log(cardID);

  const [card, setCards] = useState(null);
  const [isLoading, setLoading] = useState(true)
  // const [canvasImg, setCanvasImg] = useState(card.front_image);
  // const [frontText, setFrontText] = useState(card.front_message);
  // const [frontTextColor, setFrontTextColor] = useState(card.text_color);
  // const [textAlign, setTextAlign] = useState(card.text_align);
  // const [textFont, setTextFont] = useState(card.font);

  // const [bottomHalf, setBottomHalf] = useState("front_image");
  // const [borderColor, setBorderColor] = useState(card.border_color);
  // const [borderStyle, setBorderStyle] = useState(card.border_style);

  const [canvasImg, setCanvasImg] = useState(null);
  const [frontText, setFrontText] = useState("");
  const [frontTextColor, setFrontTextColor] = useState(null);
  const [textAlign, setTextAlign] = useState(null);
  const [textFont, setTextFont] = useState(null);

  const [bottomHalf, setBottomHalf] = useState("front-image");
  const [borderColor, setBorderColor] = useState(null);
  const [borderStyle, setBorderStyle] = useState(null);

  useEffect(() => {
    axios.get(`https://social-cards-wg2j.onrender.com/cards/${cardID}/`,{       
      headers: {
          authorization: `token ${loginToken}`,
      },
    })
      .then((res) =>{ 
        setCards(res.data);
        setFrontText(res.data.front_message)
        setCanvasImg(res.data.front_image)
        setFrontTextColor(res.data.text_color)
        setTextAlign(res.data.text_align)
        setTextFont(res.data.text_font)
        setBorderColor(res.data.border_color)
        setBorderStyle(res.data.border_style)
        
        // setLoading(false)
        // setFrontText(card.front_message)
        // setCanvasImg(card.front_image)
        // setFrontTextColor(card.text_color)
        // setTextAlign(card.text_align)
        // setTextFont(card.text_font)
        // setBorderColor(card.border_color)
        // setBorderStyle(card.border_style)
        // console.log(card)
        
        
        
    })
  },[]);



  // if (!loginToken) {
  //   return <Navigate to="/login" />;
  // }


  // if(isLoading){
  //   return <div>Loading...</div>
  // }

  
  // card && canvasImg && borderStyle &&();

  return ( card && (
    
    <div className='new-post'>
      <div className='navbar'>
        <FrontImageButton setBottomHalf={setBottomHalf} />
        <BorderButton setBottomHalf={setBottomHalf} />
        <AddTextButton setBottomHalf={setBottomHalf} />
        <SaveButton
          loginToken={loginToken}
          canvasImg={canvasImg}
          frontText={frontText}
          frontTextColor={frontTextColor}
          textAlign={textAlign}
          borderColor={borderColor}
          borderStyle={borderStyle}
          textFont={textFont}
          cardID={cardID}

        />
      </div>
      <ImageCanvas
        canvasImg={canvasImg}
        borderColor={borderColor}
        borderStyle={borderStyle}
        frontText={frontText}
        frontTextColor={frontTextColor}
        textAlign={textAlign}
        textFont={textFont}
        setTextFont={setTextFont}
      />
      <BottomHalf
        bottomHalf={bottomHalf}
        setCanvasImg={setCanvasImg}
        borderColor={borderColor}
        setBorderColor={setBorderColor}
        borderStyle={borderStyle}
        setBorderStyle={setBorderStyle}
        setFrontText={setFrontText}
        frontTextColor={frontTextColor}
        setFrontTextColor={setFrontTextColor}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
        textFont={textFont}
        setTextFont={setTextFont}
      />
    </div>
  )
    );
}




// NAVBAR BUTTONS
const FrontImageButton = ({ setBottomHalf }) => (
  <button className="effect" onClick={() => setBottomHalf("front-image")}>
    Front
  </button>
);
const AddTextButton = ({ setBottomHalf }) => (
  <button className="effect" onClick={() => setBottomHalf("add-text")}>
    Text
  </button>
);
const BorderButton = ({ setBottomHalf }) => (
  <button className="effect" onClick={() => setBottomHalf("border-select")}>
    Border
  </button>
);

function SaveButton({
  loginToken,
  canvasImg,
  frontText,
  frontTextColor,
  textAlign,
  borderColor,
  borderStyle,
  cardID,
  textFont

}) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    
    axios.patch(
      `https://social-cards-wg2j.onrender.com/cards/${cardID}/`,
      {
        title: "test",
        front_image: `${canvasImg}`,
        front_message: `${frontText}`,
        text_color: `${frontTextColor}`,
        border_color: `${borderColor}`,
        text_align: `${textAlign}`,
        border_style: `${borderStyle}`,
        font: `${textFont}`,
      },
      {
        headers: {
          authorization: `token ${loginToken}`,
        },
      }
    )
    .then((res) => {
      navigate("/");
    });
  };
  return (
    <button className="effect" onClick={handleClick}>
      Save
    </button>
  );
}

//RENDERS THE BOTTOM HALF OF THE NEW POST PAGE
function BottomHalf(props) {
  switch (props.bottomHalf) {
    case "front-image":
      return <SearchBar setCanvasImg={props.setCanvasImg} />;
    case "add-text":
      return (
        <TextInput
          setFrontText={props.setFrontText}
          frontTextColor={props.frontTextColor}
          setFrontTextColor={props.setFrontTextColor}
          setTextAlign={props.setTextAlign}
          textFont={props.textFont}
          setTextFont={props.setTextFont}

        />
      );
    case "border-select":
      return (
        <BorderSelect
          borderColor={props.borderColor}
          setBorderColor={props.setBorderColor}
          borderStyle={props.borderStyle}
          setBorderStyle={props.setBorderStyle}
        />
      );
    default:
      return;
  }
}

//NEW POST IMAGE
function ImageCanvas(props) {
  // if(props.textFont === "sans-serif")
  
  if (props.borderStyle === "none") {
    return (
      <div className="canvas">
        <img className="canvas-img" src={props.canvasImg} alt="" />
        <div
          className={props.textAlign}
          style={{ 
            color: `${props.frontTextColor}`,
            fontFamily: `${props.textFont}`
          }}>
          {props.frontText}
        </div>
      </div>
    );
  } else {
    return (
      <div className="canvas">
        <img
          style={{ border: `5px ${props.borderStyle} ${props.borderColor}` }}
          className="canvas-img"
          src={props.canvasImg}
          alt=""
        />
        <div
          className={props.textAlign}
          style={{ 
            color: `${props.frontTextColor}`,
            fontFamily: `${props.textFont}` }}>
          {props.frontText}
        </div>
      </div>
    );
  }
}

//NEW POST IMAGE SEARCH
function SearchBar({ setCanvasImg }) {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(text);
  };
  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="search-bar"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Search</button>
      </form>
      <div className="wrapper">
        <FrontCard
          token={token.token}
          query={query}
          setCanvasImg={setCanvasImg}
        />
      </div>
    </>
  );
}

//RENDERING NEW POST SEARCH RESULTS
function FrontCard({ token, query, setCanvasImg }) {
  const [img, setImg] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.unsplash.com/search/photos?query=${query}`, {
        headers: {
          Authorization: `${token}`,
          "content-type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        setImg(
          res.data.results.map((obj) => ({
            imgUrl: obj.urls.small,
          }))
        );
      });
  }, [token, query]);

  const handleClick = (i) => {
    setCanvasImg(i.imgUrl);
  };

  return (
    img.length > 0 && (
      <div className="return-box">
        <ul key={query} className="search-returns">
          {img.map((i) => (
            <div className="search-wrapper">
              <img
                key={i.imgUrl}
                className="search-element"
                onClick={() => handleClick(i)}
                src={i.imgUrl}
                alt="search result"
              />
            </div>
          ))}
        </ul>
      </div>
    )
  );
}

//New post Text Font selection and Input?
function TextInput(props) {
  const [textInputField, setTextInputField] = useState("Input text here!");
  const [displayAlign, setDisplayAlign] = useState("");
  const [displayFont, setDisplayFont] = useState("");

  const handleText = (e) => {
    e.preventDefault();
    setTextInputField(e.target.value);
    props.setFrontText(e.target.value);
  };

  const handleAlignment = (e) => {
    setDisplayAlign(e.target.value);
    props.setTextAlign(e.target.value);
  };

  const handleFont = (e) => {
    setDisplayFont(e.target.value);
    props.setTextFont(e.target.value);
  };

  return (
    <div className="text-customizer">
      <div className="front-input">
        <input onChange={handleText} value={textInputField} />
      </div>
      <label htmlFor="text-color">
        <select
          value={props.frontTextColor}
          onChange={(e) => props.setFrontTextColor(e.target.value)}
        >
          <option value="black">Black</option>
          <option value-="red">Red</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="pink">Pink</option>
          <option value="white">White</option>
        </select>
      </label>

      <label htmlFor="text-alignment">
        <select value={displayAlign} onChange={handleAlignment}>
          <option value="center">Center</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </label>
      <label htmlFor='text-font'>
        <select value={displayFont} onChange={handleFont}>
          <option value='sans-serif'>Sans Serif</option>
          <option value='serif'>Serif</option>
          <option value='monospace'>Monospace</option>
          <option value='cursive'>Cursive</option>
        </select>
      </label>
    </div>
  );
}

//Customize Border Color and Style
function BorderSelect(props) {
  return (
    <div className="border-select">
      <>
        <label htmlFor="border-style">
          Pick a Border Style
          <select
            value={props.borderStyle}
            onChange={(e) => props.setBorderStyle(e.target.value)}
          >
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value-="dotted">Dotted</option>
            <option value="double">Double</option>
          </select>
        </label>

        <label htmlFor="border-color">
          Pick a Border Color
          <select
            value={props.borderColor}
            onChange={(e) => props.setBorderColor(e.target.value)}
          >
            <option value="black">Black</option>
            <option value-="red">Red</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
            <option value="orange">Orange</option>
            <option value="pink">Pink</option>
            <option value="white">White</option>
          </select>
        </label>
      </>
    </div>
  );
}

export default EditCard;
