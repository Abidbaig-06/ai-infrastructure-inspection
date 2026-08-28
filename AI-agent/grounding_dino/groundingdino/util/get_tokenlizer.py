from transformers import AutoTokenizer, BertModel, BertTokenizer, RobertaModel, RobertaTokenizerFast
import os

def get_tokenlizer(text_encoder_type):
    if not isinstance(text_encoder_type, str):
        # print("text_encoder_type is not a str")
        if hasattr(text_encoder_type, "text_encoder_type"):
            text_encoder_type = text_encoder_type.text_encoder_type
        elif text_encoder_type.get("text_encoder_type", False):
            text_encoder_type = text_encoder_type.get("text_encoder_type")
        elif os.path.isdir(text_encoder_type) and os.path.exists(text_encoder_type):
            pass
        else:
            raise ValueError(
                "Unknown type of text_encoder_type: {}".format(type(text_encoder_type))
            )
    print("final text_encoder_type: {}".format(text_encoder_type))

    if text_encoder_type == "bert-base-uncased" or (os.path.isdir(text_encoder_type) and os.path.exists(text_encoder_type)):
        try:
            return BertTokenizer.from_pretrained(text_encoder_type)
        except Exception:
            return AutoTokenizer.from_pretrained(text_encoder_type)
    return AutoTokenizer.from_pretrained(text_encoder_type)


def get_pretrained_language_model(text_encoder_type):
    import gc
    gc.collect()
    if text_encoder_type == "bert-base-uncased" or (os.path.isdir(text_encoder_type) and os.path.exists(text_encoder_type)):
        try:
            return BertModel.from_pretrained(text_encoder_type, use_safetensors=False)
        except Exception:
            return BertModel.from_pretrained(text_encoder_type)
    if text_encoder_type == "roberta-base":
        try:
            return RobertaModel.from_pretrained(text_encoder_type, use_safetensors=False)
        except Exception:
            return RobertaModel.from_pretrained(text_encoder_type)

    raise ValueError("Unknown text_encoder_type {}".format(text_encoder_type))
