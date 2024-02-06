const PersonForm = ({nameValue, numberValue, onNameChange, onNumberChange, onClickBtn}) => {
  return (
    <form>
      <div>
        name: <input value={nameValue} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={numberValue} onChange={onNumberChange} />
      </div>
      <div>
        <button onClick={onClickBtn} type="submit">
          add
        </button>
      </div>
    </form>
  );
};

export default PersonForm