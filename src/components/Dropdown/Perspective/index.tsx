import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Stack } from "@mui/material";
import { createSvgIcon } from "@mui/material/utils";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  formControl: {
    "& .MuiInputBase-root": {
      color: "#263238",
      fontSize: "22px",
      width: "230px",
      border: "0",
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: "0px",
      width: "180px",
      fontWeight: "700",
      fontSize: "22px",
      lineHeight: "33px",
      textTransform: "capitalize",
      color: "#263238",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "0 !important",
    },

    "& .MuiOutlinedInput-input": {
      minWidth: "220px",
      border: 0,
      paddingTop: "0px",
    },
    "& .MuiSvgIcon-root": {
      width: "44px",
      /* height: 37px, */
      fontSize: "35px",
      position: "absolute",
      right: "-23px",
      top: "12px",
    },
  },
  select: {
    width: "auto",
    fontSize: "12px",
  },
  selectIcon: {
    position: "relative",
    color: "#00ACBA",
    fontSize: "30px",
  },
  paper: {
    marginTop: 8,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    "& li": {
      fontWeight: 200,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: "20px",
    },
    "& li.Mui-selected": {
      color: "rgba(38, 50, 56, 0.7)",
    },
    "& li.Mui-selected:hover": {},
  },
}));
const DropDownArrow = createSvgIcon(<path d="M11.6664 1.17334C11.6005 1.38801 11.4512 1.53965 11.3007 1.69341C9.64847 3.37876 7.99715 5.06532 6.3479 6.75402C6.14555 6.96138 5.91548 7.0582 5.63862 6.96351C5.5352 6.92819 5.43328 6.85815 5.3555 6.77868C3.64009 5.03152 1.92737 3.28193 0.215843 1.53051C-0.0717466 1.23637 -0.0705537 0.855458 0.211075 0.558581C0.343098 0.41943 0.474525 0.278451 0.618766 0.153002C0.861951 -0.0583138 1.19901 -0.0476556 1.4419 0.165487C1.47915 0.198371 1.51432 0.233996 1.54918 0.269621C2.94243 1.69311 4.33597 3.11629 5.72862 4.54038C5.7608 4.57327 5.78703 4.61194 5.8669 4.67375C5.88865 4.63264 5.90266 4.58362 5.93365 4.55195C7.33912 3.11355 8.74577 1.67636 10.153 0.239782C10.4156 -0.0281683 10.7774 -0.0817585 11.0229 0.138691C11.2733 0.363404 11.5484 0.575024 11.6667 0.916965V1.17304L11.6664 1.17334Z" fill="#00ACBA" />, "DropDownArrow");

const Perspective = ({ value }: {value: string }) => {
  const classes = useStyles();

   return (
    <FormControl className={classes.formControl}>
      <Select value={value}  displayEmpty IconComponent={() => <DropDownArrow />} inputProps={{ "aria-label": "Without label" }} sx={{ boxShadow: "none", ".MuiOutlinedInput-notchedOutline": { border: 0 }, ".Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 } }} disableUnderline>
        <MenuItem value="">Preservative status</MenuItem>

        <MenuItem>
          <Stack direction="row" justifyContent="center" className="checkbox_outer" mr={2}>
            {/* <FormControlLabel
              sx={{ margin: 0 }}
              control={<WhiteCheckbox checked/>}
              label="Surgical (6)"
            /> */}
          </Stack>
        </MenuItem>
        <MenuItem>
          <Stack direction="row" justifyContent="center" className="checkbox_outer" mr={2}>
            {/* <FormControlLabel
              sx={{ margin: 0 }}
              control={<WhiteCheckbox />}
              label="Ocular Surface (4)"
            /> */}
          </Stack>
        </MenuItem>
        <MenuItem>
          <Stack direction="row" justifyContent="center" className="checkbox_outer" mr={2}>
            {/* <FormControlLabel
              sx={{ margin: 0 }}
              control={<WhiteCheckbox />}
              label="Preop (3)"
            /> */}
          </Stack>
        </MenuItem>
        <MenuItem>
          <Stack direction="row" justifyContent="center" className="checkbox_outer" mr={2}>
            {/* <FormControlLabel
              sx={{ margin: 0 }}
              control={<WhiteCheckbox />}
              label="Postop (4)"
            /> */}
          </Stack>
        </MenuItem>
        <MenuItem>
          <Stack direction="row" justifyContent="center" className="checkbox_outer" mr={2}>
            {/* <FormControlLabel
              sx={{ margin: 0 }}
              control={<WhiteCheckbox />}
              label="Chronic eye (5)"
            /> */}
          </Stack>
        </MenuItem>
        <MenuItem>
          <Stack direction="row" justifyContent="center" className="checkbox_outer" mr={2}>
            {/* <FormControlLabel
              sx={{ margin: 0 }}
              control={<WhiteCheckbox />}
              label="Sedation (8)"
            /> */}
          </Stack>
        </MenuItem>
      </Select>
    </FormControl>
    //   <FormControl className={classes.formControl}>
    //   <Select
    //         value={value}
    //         onChange={handleChange}
    //        label="Product Category"
    //         renderValue={(selected) => selected.join(', ')}
    //         MenuProps={MenuProps}
    //       >
    //         {names.map((name) => (
    //           <MenuItem key={name} value={name}>
    //             <Checkbox checked={value.indexOf(name) > -1} />
    //             <ListItemText primary={name} />
    //           </MenuItem>
    //         ))}
    //       </Select>
    // </FormControl>
  );
};

export default Perspective;
