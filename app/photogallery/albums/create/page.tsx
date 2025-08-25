"use client";

import { createAlbum } from "@/lib/api";
import { withToast } from "@/utils/toast/withToast";
import {
  Button,
  FormControlLabel,
  Modal,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  outline: "none",
  transform: "translate(-50%, -50%)",
};

type FormData = {
  name: string;
  visibility: "veřejné" | "soukromé";
};

export default function Page() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: "",
      visibility: "veřejné",
    },
  });

  const { back, replace } = useRouter();

  const onSubmit = async (data: FormData) => {
    await withToast(createAlbum(data.name, data.visibility), {
      message: "photogallery.createAlbum",
      onSuccess: () => replace("/photogallery/albums/list"),
    });
  };

  return (
    <Modal open={true} onClose={() => back()}>
      <Paper className="p-2 min-w-[300px] flex flex-col gap-2" style={style}>
        <Typography variant="h5" className="text-center">
          Vytvořit album
        </Typography>
        <TextField
          {...register("name", { 
            required: "Jméno alba je povinné",
            pattern: {
              value: /^[a-zA-Z0-9\s]+$/,
              message: "Pouze písmena (a-z), čísla a mezery jsou povoleny"
            }
          })}
          label="Jméno alba"
          error={!!errors.name}
          helperText={errors.name?.message || "Žádné speciální znaky nejsou povoleny"}
        />
        <Controller
          name="visibility"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value === "veřejné"}
                  onChange={(e) =>
                    field.onChange(e.target.checked ? "veřejné" : "soukromé")
                  }
                />
              }
              label="Veřejné album"
            />
          )}
        />

        <Button
          disabled={!isValid}
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
        >
          Vytvořit
        </Button>
      </Paper>
    </Modal>
  );
}
