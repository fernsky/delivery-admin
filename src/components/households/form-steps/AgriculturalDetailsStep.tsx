import { useFormContext } from "react-hook-form";
import { Household } from "@/types/household";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function AgriculturalDetailsStep() {
  const { control, watch } = useFormContext<Household>();

  const haveAgriculturalLand = watch("have_agricultural_land");
  const areInvolvedInAgriculture = watch("are_involved_in_agriculture");
  const areInvolvedInHusbandry = watch("are_involved_in_husbandry");
  const haveAquaculture = watch("have_aquaculture");
  const haveApiary = watch("have_apiary");

  const foodCrops = [
    { id: "rice", label: "धान" },
    { id: "wheat", label: "गहुँ" },
    { id: "maize", label: "मकै" },
    { id: "millet", label: "कोदो" },
    { id: "barley", label: "जौ" },
  ];

  const vegetables = [
    { id: "potato", label: "आलु" },
    { id: "tomato", label: "गोलभेडा" },
    { id: "cauliflower", label: "काउली" },
    { id: "cabbage", label: "बन्दा" },
    { id: "leafy_greens", label: "साग" },
  ];

  const animals = [
    { id: "cow", label: "गाई" },
    { id: "buffalo", label: "भैंसी" },
    { id: "goat", label: "बाख्रा" },
    { id: "pig", label: "सुँगुर" },
    { id: "chicken", label: "कुखुरा" },
  ];

  const animalProducts = [
    { id: "milk", label: "दूध" },
    { id: "meat", label: "मासु" },
    { id: "eggs", label: "अण्डा" },
    { id: "wool", label: "ऊन" },
  ];

  const agriculturalMachines = [
    { id: "tractor", label: "ट्र्याक्टर" },
    { id: "power_tiller", label: "पावर टिलर" },
    { id: "thresher", label: "थ्रेसर" },
    { id: "harvester", label: "हार्भेस्टर" },
    { id: "irrigation_pump", label: "सिंचाई पम्प" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>कृषि जग्गा र बालीनाली</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="have_agricultural_land"
            render={({ field }) => (
              <FormItem>
                <FormLabel>खेतीयोग्य जग्गा छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="are_involved_in_agriculture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>कृषि कार्यमा संलग्न हुनुहुन्छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {areInvolvedInAgriculture === "yes" && (
            <>
              <FormField
                control={control}
                name="food_crops"
                render={() => (
                  <FormItem>
                    <FormLabel>उत्पादन हुने अन्नबाली</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {foodCrops.map((crop) => (
                        <FormField
                          key={crop.id}
                          control={control}
                          name="food_crops"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(crop.id) || false;

                            return (
                              <FormItem
                                key={crop.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          crop.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== crop.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {crop.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="vegetables"
                render={() => (
                  <FormItem>
                    <FormLabel>उत्पादन हुने तरकारी</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {vegetables.map((vegetable) => (
                        <FormField
                          key={vegetable.id}
                          control={control}
                          name="vegetables"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(vegetable.id) || false;

                            return (
                              <FormItem
                                key={vegetable.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          vegetable.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== vegetable.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {vegetable.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="agricultural_machines"
                render={() => (
                  <FormItem>
                    <FormLabel>कृषि औजार/मेशिनहरू</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {agriculturalMachines.map((machine) => (
                        <FormField
                          key={machine.id}
                          control={control}
                          name="agricultural_machines"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(machine.id) || false;

                            return (
                              <FormItem
                                key={machine.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          machine.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== machine.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {machine.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>पशुपालन र माछापालन</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="are_involved_in_husbandry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>पशुपालन गर्नुहुन्छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {areInvolvedInHusbandry === "yes" && (
            <>
              <FormField
                control={control}
                name="animals"
                render={() => (
                  <FormItem>
                    <FormLabel>पालिएका पशुहरू</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {animals.map((animal) => (
                        <FormField
                          key={animal.id}
                          control={control}
                          name="animals"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(animal.id) || false;

                            return (
                              <FormItem
                                key={animal.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          animal.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== animal.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {animal.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="animal_products"
                render={() => (
                  <FormItem>
                    <FormLabel>उत्पादन हुने पशुजन्य पदार्थहरू</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {animalProducts.map((product) => (
                        <FormField
                          key={product.id}
                          control={control}
                          name="animal_products"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(product.id) || false;

                            return (
                              <FormItem
                                key={product.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          product.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== product.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {product.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={control}
            name="have_aquaculture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>माछापालन गर्नुहुन्छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {haveAquaculture === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="pond_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पोखरीको संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                        placeholder="पोखरीको संख्या"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="pond_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पोखरीको क्षेत्रफल (वर्ग मिटर)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="पोखरीको क्षेत्रफल"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="fish_production"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक माछा उत्पादन (के.जी)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="वार्षिक माछा उत्पादन"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={control}
            name="have_apiary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>मौरीपालन गर्नुहुन्छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {haveApiary === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="hive_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>मौरीघारको संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                        placeholder="मौरीघारको संख्या"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="honey_production"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक मह उत्पादन (के.जी)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="वार्षिक मह उत्पादन"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="honey_sales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक मह बिक्री (के.जी)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="वार्षिक मह बिक्री"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="honey_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक मह बिक्रीबाट आम्दानी (रु)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="वार्षिक आम्दानी"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
