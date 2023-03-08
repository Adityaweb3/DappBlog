import { ethers } from "ethers";
import KolumnArtifact from "./KolumnKontract.json";

declare let window: any;
const contractAddress = "0x7D5CdeAcDcD394DBEe66Dee529063dEC82a5Ef6B";

export const Web3Service = {
  //Connect to Metamask
  connect: async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  },
  //Check if user is connected to metamask or not
  isConnected: async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      await signer.getAddress();
      return true;
    } catch {
      return false;
    }
  },
  //Get Current Wallet Address
  getWallet: async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const wallet = await signer.getAddress();
    return wallet;
  },
  //Post a Kolumn
  postKolumn: async (title: string, content: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      KolumnArtifact.abi,
      signer
    );
    const txResponse = await contract.createBlog(
      title,
      content,
      Date.now().toString()
    );
    const txRecipt = await txResponse.wait();
    console.log(txRecipt);
  },

  getLatestKolumns: async (page: Number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      KolumnArtifact.abi,
      provider
    );
    const data = await contract.viewLatestBlogs(page);
    return data;
  },

  getKolumnByID: async (id: Number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      KolumnArtifact.abi,
      provider
    );
    const data = await contract.viewBlog(id);
    return data;
  },

  sendTip: async (id: number, amount: number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      KolumnArtifact.abi,
      signer
    );
    const txResponse = await contract.sendTip(id, {
      value: ethers.utils.parseUnits(amount.toString(), "ether"),
    });
    const txRecipt = await txResponse.wait();
    console.log(txRecipt);
  },
};
