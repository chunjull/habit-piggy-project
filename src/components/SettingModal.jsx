import PropTypes from "prop-types";

const SettingModal = ({ profileData, handleSettingModal, handleChange, handleSaveAndClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="p-4 bg-white w-2/3 h-fit space-y-4 md:w-1/2 md:ml-40">
      <div className="flex justify-between">
        <h3>設定</h3>
        <button onClick={handleSettingModal}>Close</button>
      </div>
      <p className="mb-1">會員頭像</p>
      <div className="flex items-center gap-3">
        <img src={profileData.avatar} alt="user's avatar" className="w-10 h-10" />
        <div>
          <input type="file" name="avatar" id="profile" onChange={handleChange} accept="image/jpg,image/jpeg,image/png,image/gif" />
          <p>您的頭像將會被公開。</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name">會員名稱</label>
        <input type="text" name="name" id="name" placeholder="會員名稱" className="border py-1 px-4" value={profileData.name || ""} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="introduction">自我介紹</label>
        <input type="text" name="introduction" id="introduction" placeholder="自我介紹" className="border py-1 px-4" value={profileData.introduction || ""} onChange={handleChange} />
      </div>
      <div className="border"></div>
      <div className="flex justify-between items-center">
        <p>主題</p>
        <select className="border">
          <option value="light">淺色</option>
          <option value="dark">深色</option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <p>接收 Email 提醒</p>
        <select className="border">
          <option value="false">{profileData.isAcceptReminder ? "是" : "否"}</option>
          <option value="true">是</option>
        </select>
      </div>
      <button className="border w-full" onClick={handleSaveAndClose}>
        儲存
      </button>
    </div>
  </div>
);

SettingModal.propTypes = {
  profileData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSaveAndClose: PropTypes.func.isRequired,
  handleSettingModal: PropTypes.func.isRequired,
};

export default SettingModal;
