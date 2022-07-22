import { lazy } from "react";
import { useState, useEffect } from "react";
import "./styles/clustor.css";
import {useParams} from "react-router-dom";


import {fetchStorage, fetchSupply, fetchLocked} from "../utils/tzkt"
import {initOperation, issueOperation, redeemOperation, lockOperation, unlockOperation, approveOperation} from "../utils/operations"

const TokensList = lazy(() => import("../components/TokensList"));

let ListAddresses = [];

const Clustor = () => {

    const {address} = useParams();

    const [ctokenAddress, setCTokenAddress] = useState("");       
    const [loading, setLoading] = useState(false);
    const [clustorStatus, setClustorStatus] = useState(false);
    const [lockedClustors, setLockedClustors] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [name, setName] = useState("");

    const [amount, setAmount] = useState(1);

    useEffect(() => {
        (async () => {
            const storage = await fetchStorage(address);
            const supply = await fetchSupply(storage.clustorToken);
            const tokenMap = await storage.tokens;
            
            for (const token in tokenMap) {
                ListAddresses.push({address : token, value : tokenMap[token]});           
            }      

            setTotalSupply(supply);
            setClustorStatus(storage.clustorInited);
            setName(storage.clustorName);   
            setLockedClustors(Number(storage.lockedClustors));  
            setCTokenAddress(storage.clustorToken);   
        })();
            return () => {
            ListAddresses = [];
            setTotalSupply(0);
            setClustorStatus(false);
            setLockedClustors(0);
            setName("Clustor Name");
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

      const onInit = async () => {
        try {
          setLoading(true);
          await initOperation(address);
          alert("Transaction succesful!");
        } catch (err) {
          alert(err.message);
        }
        setLoading(false);
        const fstorage = await fetchStorage(address);
        setLockedClustors(Number(fstorage.lockedClustors));
        const fsupply = await fetchSupply(fstorage.clustorToken);
        setTotalSupply(fsupply);
      }
  
    const onIssue = async () => {
        try {
          setLoading(true);
          await issueOperation(address, amount);
          alert("Transaction succesful!");
        } catch (err) {
          alert(err.message);
        }
        setLoading(false);  
        const fsupply = await fetchSupply(ctokenAddress);
        setTotalSupply(fsupply);      
    }

    const onRedeem = async () => {
        try {
          setLoading(true);
          await redeemOperation(address, amount);
          alert("Transaction succesful!");
        } catch (err) {
          alert(err.message);
        }
        setLoading(false);  
        const fsupply = await fetchSupply(ctokenAddress);
        setTotalSupply(fsupply);     
    }   

    const onLock = async () => {
        try {
          setLoading(true);
          await lockOperation(address, amount);
          alert("Transaction succesful!");
        } catch (err) {
          alert(err.message);
        }
        setLoading(false);
        const locked = await fetchLocked(address);
        setLockedClustors(locked);        
    } 

    const onUnlock = async () => {
        try {
          setLoading(true);
          await unlockOperation(address, amount);
          alert("Transaction succesful!");
        } catch (err) {
          alert(err.message);
        }
        setLoading(false);
        const locked = await fetchLocked(address);
        setLockedClustors(locked);        
    }

    const onApprove = async () => {
        try {
          setLoading(true);
          for(const i in ListAddresses){
                await approveOperation(ListAddresses[i].address, address , ListAddresses[i].value * amount);
                alert("Transaction succesful!");
           }
        } catch (err) {
          alert(err.message);
        }
        setLoading(false);
        const locked = await fetchLocked(address);
        setLockedClustors(locked);        
    }


    return (
        <div className="cluster-container">
            <div className="cluster-header">
                <h2 className="cluster-title">{name}</h2>
                {clustorStatus ? 
                <div className="supply-wrapper">
                    <h2 className="cluster-supply">{"Clustor Supply : " + totalSupply}</h2>
                    <span className="cluster-list-subtext">{"Clustor Address : " + ctokenAddress}</span>
                </div>                
                : 
                    <button className="button-29" onClick={onInit}>{loading ? "Loading..." : "Initialize"}</button>
                }
            </div>
            <div className="columns-wrapper">
              <div className="lists-container">
                  <h3 className="list-header">Token List</h3>
                  <span className="cluster-list-subtext">Small note for the users</span>
                  <TokensList addresses={ListAddresses} />
                  
                  <div className="list-form">
                    <div className="list-input">
                      <input type="number" min="1" value={amount} name="input-amount" id="input-amount" onChange={(e) => setAmount(e.target.value)} />
                    </div>

                    <div className="cluster-buttons">
                        <button className="btn" onClick={onIssue}>{loading ? "Loading.." : "Issue"}</button>
                        <button className="btn" onClick={onRedeem}>{loading ? "Loading.." : "Redeem"}</button>
                        <button className="btn" onClick={onLock}>{loading ? "Loading.." : "Lock"}</button>
                        <button className="btn" onClick={onUnlock}>{loading ? "Loading.." : "Unlock"}</button>
                        <button className="btn" onClick={onApprove}>{loading ? "Loading.." : "Approve"}</button>
                    </div>
                  </div>
              </div>

              <div className="flash-loan-container">
                <div className="flash-loan-header">
                  <h3 className="flash-loan-title">Flash Loan</h3>
                </div>

                <div className="flash-loan-form">
                  <label htmlFor="token-address">Token Address</label><br />
                  <input type="text" name="token-address" id="token-address" /><br />
                  <label htmlFor="contract-address">Contract Address</label><br />
                  <input type="text" name="contract-address" id="contract-address" /><br />
                  <label htmlFor="amount">Amount: </label><br />
                  <input type="number" name="amount" id="amount"/>
                </div>

                <div className="flash-loan-footer">
                  <p className="footer-text">{"Total Locked Clustors : " + lockedClustors}</p>
                </div>

                <button className="btn execute-btn" type="submit">Execute</button>
              </div>
            </div>
            
            
            
        </div>
    );
};

export default Clustor;
