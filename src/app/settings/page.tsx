"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "@/components/modal";

export default function SettingsPage() {
  const { data: session, status } = useSession({ required: true });
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  function handleDeleteAccount() {
    if (session?.user?.username) {
      fetch(`/api/users/${session.user.username}/private`, {
        method: "DELETE",
      })
        .then(() => {
          window.location.replace("/");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function openDeleteAccountModal(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsDeleteAccountModalOpen(true);
  }

  function closeDeleteAccountModal(
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setIsDeleteAccountModalOpen(false);
  }

  return (
    <div className="min-w-full min-h-screen flex flex-col items-center py-10">
      {/* Confirm Delete Account Modal */}
      <Modal
        open={isDeleteAccountModalOpen}
        onClose={closeDeleteAccountModal}
        containerClassName="flex justify-center items-center cursor-default"
        modalClassName="max-w-[90%] w-[400px] bg-slate-800 p-6 rounded-xl flex flex-col items-center"
      >
        <span>Are you sure you want to delete your account?</span>
        <span className="text-slate-500 text-sm">
          This action is irriversible
        </span>
        <div className="flex gap-12 mt-6">
          <button
            onClick={closeDeleteAccountModal}
            className="bg-slate-900 hover:bg-slate-950 py-1 w-20 rounded"
          >
            No
          </button>
          <button
            onClick={handleDeleteAccount}
            className="py-1 w-20 rounded bg-red-500/30 border border-red-500 hover:bg-red-500/60"
          >
            Yes
          </button>
        </div>
      </Modal>

      <h1 className="text-xl">Settings</h1>
      <hr className="border border-slate-50/50 w-[60%] m-6" />
      <button
        className="btn p-2 text-red-500 border-red-500 hover:bg-red-300/20"
        onClick={openDeleteAccountModal}
      >
        Delete Account
      </button>
    </div>
  );
}
