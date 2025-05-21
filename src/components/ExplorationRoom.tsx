import React from "react";
import { useNavigate } from "react-router-dom";
import GlitchButton from "./GlitchButton";
import { useTranslation } from 'react-i18next';

const ExplorationRoom = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToExplore = () => {
    navigate("/explore");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-mono p-4">
      <h1 className="text-2xl mb-6 text-[#39ff14]">CTRL//ALT//DEL</h1>
      <p className="mb-8 text-center max-w-md">
        {t('exploration.description')}
      </p>
      <GlitchButton onClick={goToExplore}>{t('exploration.enter')}</GlitchButton>
    </div>
  );
};

export default ExplorationRoom;
