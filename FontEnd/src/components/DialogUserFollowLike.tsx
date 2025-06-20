import { Dialog } from "@headlessui/react";
import React from "react";
import { Link } from "react-router-dom";
export const ModelDilogLikeFollow = ({ isOpen, onClose, users, title }: any) => (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-zinc-900 text-white rounded-lg w-[400px] max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-bold text-center py-3 border-b border-gray-700">
            {title}
          </Dialog.Title>
          {users.length > 0 ? (
            <div className="p-4">
            {users.map((user: any) => (
              console.log(user),
              <Link to={`/${user.username}`} key={user.id} onClick={onClose}>
              <div key={user._id} className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImg || "/imagebackround.png"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.fullname}</p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                  </div>
                </div>
                
              </div>
              </Link>
            ))}
          </div>
          ) : (
            <div className="p-4 text-center font-bold">
                <p className="text-sm text-gray-400">Bạn Không Có {title}</p>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );