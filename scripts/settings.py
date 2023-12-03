import gradio as gr
from modules import shared


def on_ui_settings():
    section = "promptsbrowser", "Prompts Browser"

    """ shared.opts.add_option(
        key="pbe_show_old_setup_window",
        info=shared.OptionInfo(
            False,
            label="Show old setup window",
            section=section,
        ),
    ) """

    shared.opts.add_option(
        key="pbe_autocomplete_prompt_mode",
        info=shared.OptionInfo(
            "Prompts and styles",
            label="Autocomplete mode (What will be displayed in the autocomplete window)",
            component=gr.Dropdown,
            component_args={"choices": [
                "Off",
                "Prompts only",
                "Styles only",
                "Prompts and styles"
            ]},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_show_prompt_index",
        info=shared.OptionInfo(
            False,
            label="Show prompt index in database",
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_support_extended_syntax",
        info=shared.OptionInfo(
            True,
            label="Extended syntax support",
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_below_one_weight",
        info=shared.OptionInfo(
            0.05,
            label="Below 1 scroll weight",
            component=gr.Slider,
            component_args={"minimum": 0.01, "maximum": 1, "step": 0.05},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_above_one_weight",
        info=shared.OptionInfo(
            0.1,
            label="Above 1 scroll weight",
            component=gr.Slider,
            component_args={"minimum": 0.01, "maximum": 1, "step": 0.05},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_to_lower_case",
        info=shared.OptionInfo(
            True,
            label="Transform prompts to lower case",
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_space_mode",
        info=shared.OptionInfo(
            "To space",
            label="Spaces in prompts transform",
            component=gr.Dropdown,
            component_args={"choices": [
                "Do nothing",
                "To space",
                "To underscore",
            ]},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_card_width",
        info=shared.OptionInfo(
            50,
            label="Card width",
            component=gr.Slider,
            component_args={"minimum": 10, "maximum": 1000, "step": 1},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_card_height",
        info=shared.OptionInfo(
            100,
            label="Card height",
            component=gr.Slider,
            component_args={"minimum": 10, "maximum": 1000, "step": 1},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_splash_card_width",
        info=shared.OptionInfo(
            200,
            label="Splash Card width",
            component=gr.Slider,
            component_args={"minimum": 10, "maximum": 1000, "step": 1},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_splash_card_height",
        info=shared.OptionInfo(
            300,
            label="Splash Card height",
            component=gr.Slider,
            component_args={"minimum": 10, "maximum": 1000, "step": 1},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_rows_in_known_cards",
        info=shared.OptionInfo(
            3,
            label="Rows in a cards list",
            component=gr.Slider,
            component_args={"minimum": 1, "maximum": 100, "step": 1},
            section=section,
        ),
    )

    shared.opts.add_option(
        key="pbe_max_cards_shown",
        info=shared.OptionInfo(
            1000,
            label="Max shown cards in a list",
            component=gr.Slider,
            component_args={"minimum": 1, "maximum": 10000, "step": 1},
            section=section,
        ),
    )
