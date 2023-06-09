//CSS
import styles from "./CreatePost.module.css";
// IMG
import img from "../../assets/img/url-imagem.jpg";
// Hook
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();

  const { insertDocument, response } = useInsertDocument("posts");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Validar URL da imagem
    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ser uma URL.");
      return;
    }

    // Criar Array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    // Checar todos os valores
    if (!title || !image || !tags || !body) {
      setFormError("Por favor, preencha todos os dados.");
      return;
    }

    if (
      title.trim() === "" ||
      image.trim() === "" ||
      tags.trim() === "" ||
      body.trim() === ""
    ) {
      setFormError("Por favor, não deixe só com espaços em branco.");
      return;
    }

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    });

    // Redirect para a home page
    navigate("/");
  };

  return (
    <div className={styles.createPost}>
      <h1>Criar post</h1>
      <p>Escreva sobre o seu o que quiser compartilhar</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input
            type="text"
            name="title"
            required
            maxLength={60}
            placeholder="Digite aqui seu título..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label>
          <span>Url da imagem:</span>
          <input
            type="text"
            name="image"
            required
            placeholder="Insira uma imagem com o seu meme..."
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>
        <label>
          <span>Conteúdo:</span>
          <textarea
            type="text"
            name="body"
            required
            maxLength={1000}
            placeholder="Insira o conteúdo do post..."
            onChange={(e) => setBody(e.target.value)}
            value={body}
          />
        </label>
        <label>
          <span>Tags:</span>
          <textarea
            type="text"
            name="tags"
            required
            placeholder="Insira as tags separadas por vírgula..."
            onChange={(e) => setTags(e.target.value)}
            maxLength={40}
            value={tags}
          />
        </label>
        {!response.loading && <button className="btn">Criar post!</button>}
        {response.loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {response.error && <p className="error">{response.error}</p>}
        {formError && <p className="error">{formError}</p>}
        <h2>Como pegar a url da imagem?</h2>
        <p>Lembrando que não é o link do site e sim o da imagem. Você pode editar depois caso queira.</p>
        <p>Sites como WhatsApp e Instagram não fornecem a opção de pegar a imagem.</p>
        <img src={img} alt="Explicando como pegar a URL da Imagem" />
      </form>
    </div>
  );
};

export default CreatePost;
