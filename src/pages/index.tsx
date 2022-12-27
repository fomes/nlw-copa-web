import Image from "next/image";
import appPreviewImage from "../assets/app-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatar from "../assets/avatares.png";
import imageCheck from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";
import Swal from "sweetalert2";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  const createPool = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const resp = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = resp.data;

      await navigator.clipboard.writeText(code);
      Swal.fire({
        icon: "success",
        title: "Bolão criado com sucesso!",
        text: "Código copiado para área de transferência",
      });

      setPoolTitle("");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Erro ao criar bolão!",
        text: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatar} alt="Ícones de avatares" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount} </span>pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar seus amigos. 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image src={imageCheck} alt="" />
            <div className="flex flex-col text-white">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={imageCheck} alt="" />
            <div className="flex flex-col text-white">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImage} alt="Dois smartphones" quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResp, guessCountResp, userCountResp] = await Promise.all([
    api.get("pools/count"),
    api.get("guesses/count"),
    api.get("users/count"),
  ]);

  return {
    props: {
      poolCount: poolCountResp.data.count,
      guessCount: guessCountResp.data.count,
      userCount: userCountResp.data.count,
    },
  };
};
