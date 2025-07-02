import React, { useState } from 'react';

const TokenForm = ({ onSubmit, isDeploying }) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Token name is required';
    }
    
    if (!symbol.trim()) {
      newErrors.symbol = 'Token symbol is required';
    } else if (symbol.length > 5) {
      newErrors.symbol = 'Symbol should be 5 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(name, symbol);
    }
  };

  return (
    <form className="token-form" onSubmit={handleSubmit}>
      <h2>🍭 Create Your Sweet Token 🍬</h2>
      <p>Fill in the details below to mint your own candy token!</p>
      
      <div className="form-group">
        <label htmlFor="tokenName">Token Name:</label>
        <input
          type="text"
          id="tokenName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Bubblegum Coin"
          disabled={isDeploying}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="tokenSymbol">Token Symbol:</label>
        <input
          type="text"
          id="tokenSymbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="e.g., GUM"
          maxLength={5}
          disabled={isDeploying}
        />
        {errors.symbol && <p className="error-text">{errors.symbol}</p>}
      </div>
      
      <button 
        type="submit" 
        className="action-button"
        disabled={isDeploying}
      >
        {isDeploying ? 'Creating Token...' : 'Create Token!'}
      </button>
    </form>
  );
};

export default TokenForm;
